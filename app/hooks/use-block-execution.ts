import { useCallback, useState } from "react";
import { type Block } from "@/app/types";

interface UseBlockExecutionProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  parsePromptTemplate: (template: string, blocks: Block[], currentIndex: number) => string;
}

export function useBlockExecution({ blocks, onBlocksChange, parsePromptTemplate }: UseBlockExecutionProps) {
  const [isFlowExecuting, setIsFlowExecuting] = useState(false);

  const executeBlock = useCallback(async (blockIndex: number) => {
    const block = blocks[blockIndex];
    console.log(`\nExecuting block:`, block.name, block.type);

    if (block.type === "Generate") {
      onBlocksChange(
        blocks.map((b) => (b.id === block.id ? { ...b, isExecuting: true } : b))
      );

      try {
        const parsedPrompt = parsePromptTemplate(
          block.settings.prompt || "",
          blocks,
          blockIndex
        );
        console.log("Sending prompt to API:", parsedPrompt);

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: parsedPrompt,
            generateType: block.settings.generateType,
            temperature: block.settings.temperature,
            maxTokens: block.settings.maxTokens,
            ...(block.settings.generateType === "object"
              ? { schemaDefinition: block.settings.schemaDefinition }
              : {}),
          }),
        });

        let result: string | object;
        if (block.settings.generateType === "text") {
          result = await response.text();
        } else {
          const data = await response.json();
          result = data.result;
        }

        console.log("Received result:", result);

        onBlocksChange(
          blocks.map((b) =>
            b.id === block.id ? { ...b, result, isExecuting: false } : b
          )
        );
      } catch (error) {
        console.error("Error executing block:", error);
        onBlocksChange(
          blocks.map((b) =>
            b.id === block.id
              ? { ...b, result: "Error executing block", isExecuting: false }
              : b
          )
        );
      }
    } else if (block.type === "Input") {
      onBlocksChange(
        blocks.map((b) =>
          b.id === block.id ? { ...b, result: b.settings.input } : b
        )
      );
    }
  }, [blocks, onBlocksChange, parsePromptTemplate]);

  const executeFlow = useCallback(async () => {
    setIsFlowExecuting(true);
    let currentBlocks = [...blocks];
    
    try {
      for (let i = 0; i < blocks.length; i++) {
        const block = currentBlocks[i];
        console.log(`\nExecuting flow block ${i}:`, block.name, block.type);

        if (block.type === "Generate") {
          currentBlocks = currentBlocks.map((b, idx) => 
            idx === i ? { ...b, isExecuting: true } : b
          );
          onBlocksChange(currentBlocks);

          try {
            const parsedPrompt = parsePromptTemplate(
              block.settings.prompt || "",
              currentBlocks,
              i
            );
            console.log("Flow execution - sending prompt to API:", parsedPrompt);

            const response = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: parsedPrompt,
                generateType: block.settings.generateType,
                temperature: block.settings.temperature,
                maxTokens: block.settings.maxTokens,
                ...(block.settings.generateType === "object"
                  ? { schemaDefinition: block.settings.schemaDefinition }
                  : {}),
              }),
            });

            let result: string | object;
            if (block.settings.generateType === "text") {
              result = await response.text();
            } else {
              const data = await response.json();
              result = data.result;
            }

            currentBlocks = currentBlocks.map((b, idx) =>
              idx === i ? { ...b, result, isExecuting: false } : b
            );
            onBlocksChange(currentBlocks);
            
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error) {
            console.error("Error executing block in flow:", error);
            currentBlocks = currentBlocks.map((b, idx) =>
              idx === i ? { ...b, result: "Error executing block", isExecuting: false } : b
            );
            onBlocksChange(currentBlocks);
            break;
          }
        } else if (block.type === "Input") {
          currentBlocks = currentBlocks.map((b, idx) =>
            idx === i ? { ...b, result: b.settings.input } : b
          );
          onBlocksChange(currentBlocks);
        }
      }
    } finally {
      setIsFlowExecuting(false);
    }
  }, [blocks, onBlocksChange, parsePromptTemplate]);

  const executeBlockByKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "Enter") {
        const blockElement = document.activeElement?.closest("[data-block-id]");
        if (blockElement) {
          const blockId = blockElement.getAttribute("data-block-id");
          const blockIndex = blocks.findIndex((b) => b.id === blockId);

          if (blockIndex !== -1 && blocks[blockIndex].type === "Generate") {
            e.preventDefault();
            executeBlock(blockIndex);
          }
        }
      }
      
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        executeFlow();
      }
    },
    [blocks, executeBlock, executeFlow]
  );

  return {
    executeBlock,
    executeBlockByKeyboard,
    executeFlow,
    isFlowExecuting,
  };
} 
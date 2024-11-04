"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Wand2, ArrowBigUp, Command } from "lucide-react";
import { BlockList } from "../components/block-list";
import { type Block, type BlockType } from "./types";
import { useBlockExecution } from "./hooks/use-block-execution";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { useBlocks } from "../app/hooks/use-blocks";
import { KeyboardShortcutsDialog } from "../components/keyboard-shortcuts-dialog";

export default function Component() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);

  const { removeBlock, toggleBlockExpanded } = useBlocks({ blocks, onBlocksChange: setBlocks });

  const parsePromptTemplate = useCallback(
    (template: string, blocks: Block[], currentIndex: number): string => {
      console.log("Parsing template:", template);

      return template.replace(/@\[([^\]]+)\]\(([^)]+)\)/g, (_, display) => {
        const previousBlock = blocks[currentIndex - 1];
        if (previousBlock?.name !== display) {
          console.log("Block name mismatch:", { expected: display, actual: previousBlock?.name });
          return "";
        }

        // For Input blocks, use the input value
        if (previousBlock.type === "Input") {
          const value = previousBlock.settings.input || "";
          console.log("Using input value:", value);
          return value;
        }

        // For Generate blocks, use the result
        if (previousBlock.result) {
          if (Array.isArray(previousBlock.result)) {
            // If it's an array, map through and stringify each item
            const stringified = previousBlock.result
              .map((item) => (typeof item === "object" ? JSON.stringify(item) : String(item)))
              .join(", ");
            console.log("Using array result:", stringified);
            return stringified;
          } else if (typeof previousBlock.result === "object") {
            // If it's a single object, stringify it
            const stringified = JSON.stringify(previousBlock.result);
            console.log("Using object result:", stringified);
            return stringified;
          } else {
            // For primitive values, convert to string
            const value = String(previousBlock.result);
            console.log("Using primitive result:", value);
            return value;
          }
        }

        console.log("No valid value found, returning empty string");
        return "";
      });
    },
    [] // No dependencies needed as it's a pure function
  );

  const { executeBlock, executeBlockByKeyboard, executeFlow, isFlowExecuting } = useBlockExecution({
    blocks,
    onBlocksChange: setBlocks,
    parsePromptTemplate,
  });

  useEffect(() => {
    document.addEventListener("keydown", executeBlockByKeyboard);
    return () => {
      document.removeEventListener("keydown", executeBlockByKeyboard);
    };
  }, [executeBlockByKeyboard]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      expanded: true,
      name: type,
      settings: {
        generateType: "text",
        temperature: 0.7,
        maxTokens: 1000,
      },
    };
    setBlocks([...blocks, newBlock]);
  };

  const { shortcuts } = useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'Enter',
        cmd: true,
        description: 'Execute current block',
        handler: () => {
          const blockElement = document.activeElement?.closest("[data-block-id]");
          if (blockElement) {
            const blockId = blockElement.getAttribute("data-block-id");
            const blockIndex = blocks.findIndex((b) => b.id === blockId);
            if (blockIndex !== -1 && blocks[blockIndex].type === "Generate") {
              executeBlock(blockIndex);
            }
          }
        },
      },
      {
        key: 'Enter',
        cmd: true,
        shift: true,
        description: 'Execute flow',
        handler: () => executeFlow(),
      },
      {
        key: 'Backspace',
        cmd: true,
        description: 'Delete current block',
        handler: (e) => {
          e.preventDefault();
          const blockElement = document.activeElement?.closest("[data-block-id]");
          if (blockElement) {
            const blockId = blockElement.getAttribute("data-block-id");
            if (blockId) removeBlock(blockId);
          }
        },
      },
      {
        key: '/',
        cmd: true,
        description: 'Open settings for current block',
        handler: (e) => {
          e.preventDefault();
          const blockElement = document.activeElement?.closest("[data-block-id]");
          if (blockElement) {
            const blockId = blockElement.getAttribute("data-block-id");
            setOpenSettingsId(blockId);
          }
        },
      },
      {
        key: 'ArrowUp',
        alt: true,
        description: 'Collapse block',
        handler: (e) => {
          e.preventDefault();
          const blockElement = document.activeElement?.closest("[data-block-id]");
          if (blockElement) {
            const blockId = blockElement.getAttribute("data-block-id");
            if (blockId) {
              const block = blocks.find(b => b.id === blockId);
              if (block?.expanded) {
                toggleBlockExpanded(blockId);
              }
            }
          }
        },
      },
      {
        key: 'ArrowDown',
        alt: true,
        description: 'Expand block',
        handler: (e) => {
          e.preventDefault();
          const blockElement = document.activeElement?.closest("[data-block-id]");
          if (blockElement) {
            const blockId = blockElement.getAttribute("data-block-id");
            if (blockId) {
              const block = blocks.find(b => b.id === blockId);
              if (!block?.expanded) {
                toggleBlockExpanded(blockId);
              }
            }
          }
        },
      },
      {
        key: 'g',
        cmd: true,
        shift: true,
        description: 'Add Generate block',
        handler: (e) => {
          e.preventDefault();
          addBlock("Generate");
        },
      },
      {
        key: 'i',
        cmd: true,
        shift: true,
        description: 'Add Input block',
        handler: (e) => {
          e.preventDefault();
          addBlock("Input");
        },
      },
    ],
  });

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">LLM Flow Builder</h1>
            <KeyboardShortcutsDialog shortcuts={shortcuts} />
          </div>
          <p className="text-muted-foreground">Create and test different modular LLM flows</p>
        </div>

        <BlockList
          blocks={blocks}
          onBlocksChange={setBlocks}
          openSettingsId={openSettingsId}
          setOpenSettingsId={setOpenSettingsId}
          executeBlock={executeBlock}
        />

        <div className="flex gap-2 mt-8">
          <Button
            onClick={() => addBlock("Input")}
            variant="outline"
            className="hover:bg-purple-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-purple-600" />
            Add Input
          </Button>
          <Button
            onClick={() => addBlock("Generate")}
            variant="outline"
            className="hover:bg-amber-50 transition-colors"
          >
            <Wand2 className="w-4 h-4 mr-2 text-amber-600" />
            Add Generate
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={executeFlow}
                  variant="default"
                  className="ml-auto"
                  disabled={blocks.length === 0 || isFlowExecuting}
                >
                  {isFlowExecuting ? (
                    <>
                      <LoadingSpinner size={16} className="mr-2" />
                      Executing...
                    </>
                  ) : (
                    'Execute Flow'
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-1 bg-[#FBFBFC] border border-border rounded-md shadow-sm p-2">
              <span className="text-sm text-secondary-foreground mr-2 ">Execute flow</span>

                <Kbd><Command className="w-3.5 h-3.5" strokeWidth={1.5} /></Kbd>
                <Kbd><ArrowBigUp className="w-3.5 h-3.5" strokeWidth={1.5} /></Kbd>
                <Kbd>Enter</Kbd>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

import { type Block, type BlockType } from "../types";

interface CreateShortcutsConfig {
  blocks: Block[];
  executeBlock: (index: number) => Promise<void>;
  executeFlow: () => Promise<void>;
  removeBlock: (id: string) => void;
  setOpenSettingsId: (id: string | null) => void;
  toggleBlockExpanded: (id: string) => void;
  addBlock: (type: BlockType) => void;
}

export function createShortcuts({
  blocks,
  executeBlock,
  executeFlow,
  removeBlock,
  setOpenSettingsId,
  toggleBlockExpanded,
  addBlock,
}: CreateShortcutsConfig) {
  return [
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
      shift: true,
      description: 'Delete current block',
      handler: (e: KeyboardEvent) => {
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
      handler: (e: KeyboardEvent) => {
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
      handler: (e: KeyboardEvent) => {
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
      handler: (e: KeyboardEvent) => {
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
      handler: (e: KeyboardEvent) => {
        e.preventDefault();
        addBlock("Generate");
      },
    },
    {
      key: 'i',
      cmd: true,
      shift: true,
      description: 'Add Input block',
      handler: (e: KeyboardEvent) => {
        e.preventDefault();
        addBlock("Input");
      },
    },
  ];
} 
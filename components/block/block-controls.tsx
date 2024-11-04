import { Button } from "@/components/ui/button";
import { Block } from "@/app/types";
import { ChevronDown, ChevronUp, Play, Settings2, Trash2 } from "lucide-react";
import { BlockSettings } from "../block-settings";

interface BlockControlsProps {
  block: Block;
  index: number;
  openSettingsId: string | null;
  setOpenSettingsId: (id: string | null) => void;
  executeBlock: (blockIndex: number) => Promise<void>;
  toggleBlockExpanded: (id: string) => void;
  removeBlock: (id: string) => void;
  updateBlockSettings: (id: string, settings: Partial<Block['settings']>) => void;
}

export function BlockControls({
  block,
  index,
  openSettingsId,
  setOpenSettingsId,
  executeBlock,
  toggleBlockExpanded,
  removeBlock,
  updateBlockSettings,
}: BlockControlsProps) {
  return (
    <div className="flex items-center gap-1">
      {block.type === "Generate" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              executeBlock(index);
            }}
            disabled={block.isExecuting}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Play className="w-4 h-4" />
          </Button>
          <BlockSettings
            block={block}
            onUpdate={(settings) => updateBlockSettings(block.id, settings)}
            isOpen={openSettingsId === block.id}
            onOpenChange={(open) => setOpenSettingsId(open ? block.id : null)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setOpenSettingsId(block.id);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </>
      )}
      <Button variant="ghost" size="icon" onClick={() => toggleBlockExpanded(block.id)}>
        {block.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeBlock(block.id)}
        className="text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
} 
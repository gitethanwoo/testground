import { Button } from "@/components/ui/button";
import { Settings2, Play, ChevronDown, ChevronUp, X, Command, MoreVertical } from "lucide-react";
import { BlockSettings } from "../block-settings";
import { type Block } from "@/app/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";

interface BlockControlsProps {
  block: Block;
  index: number;
  openSettingsId: string | null;
  setOpenSettingsId: (id: string | null) => void;
  executeBlock: (index: number) => Promise<void>;
  toggleBlockExpanded: (id: string) => void;
  removeBlock: (id: string) => void;
  updateBlockSettings: (id: string, settings: Partial<Block["settings"]>) => void;
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
      <TooltipProvider>
        {block.type === "Generate" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-blue-50 text-blue-600"
                onClick={() => executeBlock(index)}
                disabled={block.isExecuting}
              >
                <Play className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-1 bg-[#FBFBFC] border border-border rounded-md shadow-sm p-2">
              <span className="text-sm text-secondary-foreground mr-2">Execute block</span>
              <Kbd><Command className="w-3.5 h-3.5" strokeWidth={1.5} /></Kbd>
              <Kbd>Enter</Kbd>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setOpenSettingsId(block.id)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-1 bg-[#FBFBFC] border border-border rounded-md shadow-sm p-2">
            <span className="text-sm text-secondary-foreground mr-2">Block settings</span>
            <Kbd><Command className="w-3.5 h-3.5" strokeWidth={1.5} /></Kbd>
            <Kbd>/</Kbd>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => toggleBlockExpanded(block.id)}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                {block.expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expand
                  </>
                )}
              </div>
              <div className="flex items-center ml-2 text-xs gap-1 text-muted-foreground">
                <Kbd>Alt</Kbd>
                <Kbd>{block.expanded ? '↑' : '↓'}</Kbd>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => removeBlock(block.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <X className="h-4 w-4 mr-2" />
                Delete
              </div>
              <div className="flex items-center ml-2 text-xs gap-1 text-muted-foreground">
                <Kbd><Command className="w-3 h-3" strokeWidth={1.5} /></Kbd>
                <Kbd>Delete</Kbd>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BlockSettings
        block={block}
        open={openSettingsId === block.id}
        onOpenChange={(open) => setOpenSettingsId(open ? block.id : null)}
        onSettingsChange={updateBlockSettings}
      />
    </div>
  );
} 
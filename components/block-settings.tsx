import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SchemaBuilder } from "./schema-builder";
import { type Block } from "../app/types";

interface BlockSettingsProps {
  block: Block;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsChange: (id: string, settings: Partial<Block["settings"]>) => void;
}

export function BlockSettings({
  block,
  open,
  onOpenChange,
  onSettingsChange,
}: BlockSettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Block Settings: {block.name}</SheetTitle>
          <SheetDescription>Configure generation parameters for this block</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Generation Type</Label>
            <div className="flex gap-4">
              <Button
                variant={block.settings.generateType === "text" ? "default" : "outline"}
                onClick={() => onSettingsChange(block.id, { generateType: "text" })}
                className="flex-1"
              >
                Text
              </Button>
              <Button
                variant={block.settings.generateType === "object" ? "default" : "outline"}
                onClick={() => onSettingsChange(block.id, { generateType: "object" })}
                className="flex-1"
              >
                Object
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Temperature</Label>
            <div className="pt-2">
              <Slider
                defaultValue={[block.settings.temperature ?? 0.7]}
                max={2}
                step={0.1}
                onValueChange={([value]) => onSettingsChange(block.id, { temperature: value })}
              />
              <div className="text-sm text-muted-foreground mt-1">
                Current value: {block.settings.temperature ?? 0.7}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Higher values make output more creative but less predictable
            </p>
          </div>

          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={block.settings.maxTokens ?? 1000}
              onChange={(e) => onSettingsChange(block.id, { maxTokens: parseInt(e.target.value) })}
              min={1}
              max={4000}
            />
            <p className="text-sm text-muted-foreground">Maximum length of generated content</p>
          </div>

          {block.settings.generateType === "object" && (
            <div className="space-y-2">
              <Label>Object Schema</Label>
              <SchemaBuilder
                value={block.settings.schemaDefinition ?? { outputType: "object" }}
                onChange={(schema) => onSettingsChange(block.id, { schemaDefinition: schema })}
              />
              <p className="text-sm text-muted-foreground">
                Define the structure of the object to be generated
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

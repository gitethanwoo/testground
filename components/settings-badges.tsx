import React from "react";
import { Badge } from "@/components/ui/badge";
import { Type, Hash, ListTree, Thermometer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Block } from "../app/types";

interface SettingsBadgesProps {
  settings: Block["settings"];
}

export function SettingsBadges({ settings }: SettingsBadgesProps) {
  return (
    <TooltipProvider>
      <div className="flex gap-1.5 items-center">
        {/* Generation Type Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline">
              {settings.generateType === "text" ? (
                <Type className="w-3 h-3 mr-1" />
              ) : (
                <ListTree className="w-3 h-3 mr-1" />
              )}
              {settings.generateType}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Generation Type</TooltipContent>
        </Tooltip>

        {/* Temperature Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline">
              <Thermometer className="w-3 h-3 mr-1" />
              {settings.temperature}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Temperature</TooltipContent>
        </Tooltip>

        {/* Max Tokens Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline">
              <Hash className="w-3 h-3 mr-1" />
              {settings.maxTokens}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Max Tokens</TooltipContent>
        </Tooltip>

        {/* Schema Badge - only show if object type and schema is defined */}
        {settings.generateType === "object" && settings.schemaDefinition && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                <ListTree className="w-3 h-3 mr-1" />
                {settings.schemaDefinition.properties?.length || 0} fields
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="w-80">
              <div className="space-y-2">
                <p className="font-medium">Schema Definition</p>
                <div className="space-y-1">
                  {settings.schemaDefinition.properties?.map((prop, i) => (
                    <div key={i} className="text-sm flex items-center gap-2">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {prop.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {prop.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
} 
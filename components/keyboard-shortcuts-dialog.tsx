import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Command, ArrowBigUp, Option } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ShortcutItem {
  key: string;
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
}

interface KeyboardShortcutsDialogProps {
  shortcuts: ShortcutItem[];
}

export function KeyboardShortcutsDialog({ shortcuts }: KeyboardShortcutsDialogProps) {
  const getKeyDisplay = (key: string) => {
    switch (key.toLowerCase()) {
      case 'enter':
        return 'Enter';
      case 'delete':
        return 'Delete';
      case ',':
        return ',';
      default:
        return key;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Command strokeWidth={1.5} className="w-4 h-4 text-foreground" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut, i) => (
            <div key={i}>
              <div className="flex items-center justify-between pt-1 pb-3">
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <div className="flex items-center gap-1">
                  {shortcut.cmd && (
                    <Kbd>
                      <Command className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Kbd>
                  )}
                  {shortcut.shift && (
                    <Kbd>
                      <ArrowBigUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Kbd>
                  )}
                  {shortcut.alt && (
                    <Kbd>
                      <Option className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Kbd>
                  )}
                  <Kbd>{getKeyDisplay(shortcut.key)}</Kbd>
                </div>
              </div>
              {i < shortcuts.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 
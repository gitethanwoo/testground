import { useEffect, useCallback } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: ShortcutHandler;
  description: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: ShortcutConfig[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    shortcuts.forEach(({ key, cmd, shift, alt, handler }) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!cmd || (e.metaKey || e.ctrlKey)) &&
        (!shift || e.shiftKey) &&
        (!alt || e.altKey)
      ) {
        e.preventDefault();
        handler(e);
      }
    });
  }, [shortcuts, enabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return all shortcuts for documentation/UI purposes
  return {
    shortcuts: shortcuts.map(({ key, cmd, shift, alt, description }) => ({
      key,
      cmd,
      shift,
      alt,
      description,
    })),
  };
} 
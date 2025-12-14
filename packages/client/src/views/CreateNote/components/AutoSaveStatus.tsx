import React from 'react';
import { CheckCircle, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AutoSaveStatusProps {
  lastSavedAt?: string | null;
  noteId?: string;
  status: `idle` | `saving` | `saved` | `error`;
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ lastSavedAt, noteId, status }) => {
  const renderBadge = () => {
    switch (status) {
      case `saving`:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Save size={16} />
          {` `}
          Saving...
        </Badge>;
      case `saved`:
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle size={16} />
          {` `}
          Saved
        </Badge>;
      case `error`:
        return <Badge variant="destructive" className="flex items-center gap-1">
          Save Failed
        </Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center gap-1">
          Idle
        </Badge>;
    }
  };

  const renderStatusText = () => {
    switch (status) {
      case `saving`:
        return `Saving changes...`;
      case `saved`:
        return lastSavedAt ? `Last saved at ${lastSavedAt}` : ``;
      case `error`:
        return `Will retry...`;
      case `idle`:
        return noteId && lastSavedAt ? `Saved at ${lastSavedAt}` : ``;
      default:
        return ``;
    }
  };

  return <div className="ml-auto flex flex-col items-end gap-1">
    {renderBadge()}
    <span className="text-[10px] leading-tight text-muted-foreground">
      {renderStatusText()}
    </span>
  </div>;
};

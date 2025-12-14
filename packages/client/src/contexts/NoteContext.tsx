import { createContext, useContext } from 'react';
import { DocumentationDTO } from '../../../types/services';

export interface INoteContext {
  autoSaveStatus: `idle` | `saving` | `saved` | `error`;
  lastSavedAt: string | null;
  noteData: Partial<DocumentationDTO>;
  setAutoSaveStatus: (status: `idle` | `saving` | `saved` | `error`) => void;
  setLastSavedAt: (timestamp: string | null) => void;
  setNoteData: (data: Partial<DocumentationDTO>) => void;
}

export const NoteContext = createContext<INoteContext | undefined>(undefined);

export const useNoteContext = (): INoteContext => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error(`useNoteContext must be used within a NoteProvider`);
  }
  return context;
};

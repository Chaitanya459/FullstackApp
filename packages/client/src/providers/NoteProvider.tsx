import React, { useState } from 'react';
import { DocumentationDTO } from '../../../types/services';
import { INoteContext, NoteContext } from '@/contexts/NoteContext';

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ noteData, setNoteData ] = useState<Partial<DocumentationDTO>>({});
  const [ autoSaveStatus, setAutoSaveStatus ] = useState<`idle` | `saving` | `saved` | `error`>(`idle`);
  const [ lastSavedAt, setLastSavedAt ] = useState<string | null>(null);

  const value: INoteContext = {
    autoSaveStatus,
    lastSavedAt,
    noteData,
    setAutoSaveStatus,
    setLastSavedAt,
    setNoteData,
  };

  return <NoteContext.Provider value={value}>
    {children}
  </NoteContext.Provider>;
};

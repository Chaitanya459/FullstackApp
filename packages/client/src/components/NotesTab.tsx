import React, { useMemo, useState } from 'react';
import { Download, SearchIcon } from 'lucide-react';
import { DocumentationDTO } from 'rsd';
import { NoteCard } from './NoteCard';
import { NoteSheet } from './NoteSheet';
import { Button } from './ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from './ui/input-group';
import { filterDistrictNotes } from '@/utils/noteFilter';

interface NotesTabProps {
  isLoading?: boolean;
  noNotesMessage?: string;
  notes: DocumentationDTO[];
  searchPlaceholder?: string;
  sheetTitle?: string;
  showDirectMinutes?: boolean;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  isLoading = false,
  noNotesMessage = `No notes available`,
  notes,
  searchPlaceholder = `Search Notes or Filter by Note Type`,
  sheetTitle = `Note Details`,
  showDirectMinutes = true,
}) => {
  const [ searchTerm, setSearchTerm ] = useState(``);

  const totalDirect = useMemo(
    () => notes?.reduce((sum, note) => sum + (note.directMinutes || 0), 0) ?? 0,
    [ notes ],
  );

  const totalIndirect = useMemo(
    () => notes?.reduce((sum, note) => sum + (note.indirectMinutes || 0), 0) ?? 0,
    [ notes ],
  );

  const totalTravel = useMemo(
    () => notes?.reduce((sum, note) => sum + (note.travelMinutes || 0), 0) ?? 0,
    [ notes ],
  );

  const filteredNotes = useMemo(
    () => filterDistrictNotes(notes ?? [], searchTerm),
    [ notes, searchTerm ],
  );

  return <div className="w-full py-5">
    <div className="flex">
      <div className="flex w-3/4 flex-wrap items-center gap-6 px-6 text-sm text-muted-foreground">
        <span>Total Notes: {notes?.length ?? 0}</span>
        {showDirectMinutes && <span>Total Direct: {totalDirect}m</span>}
        <span>Total Indirect: {totalIndirect}m</span>
        <span>Total Travel: {totalTravel}m</span>
      </div>
      <div className="mx-6 flex w-1/2 justify-end">
        <Button color="secondary" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {` `}
          Export
        </Button>
      </div>
    </div>
    <div className="gap-g mx-8 my-4 grid w-full max-w-sm">
      <InputGroup>
        <InputGroupInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>

    {isLoading &&
      <div className="my-8 text-center text-muted-foreground">
        Loading notes...
      </div>}

    {!isLoading && filteredNotes.length === 0 &&
      <div className="my-8 text-center text-muted-foreground">
        {searchTerm ?
          `No notes found matching "${searchTerm}"` :
          noNotesMessage}
      </div>}

    <div className="my-8 space-y-3 px-8">
      {filteredNotes.map((note) =>
        <NoteCard
          key={note.id}
          note={note}
          showDirectMinutes={showDirectMinutes}
        >
          <NoteSheet note={note} sheetTitle={sheetTitle} showDirectMinutes={showDirectMinutes} />
        </NoteCard>)}
    </div>
  </div>;
};

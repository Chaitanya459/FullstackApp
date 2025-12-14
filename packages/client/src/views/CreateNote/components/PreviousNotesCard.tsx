import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { DocumentationDTO } from 'rsd';
import { parseISO, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PreviousNotesCardProps {
  notes: DocumentationDTO[] | undefined;
}

export const PreviousNotesCard: React.FC<PreviousNotesCardProps> = ({ notes }) => {
  const [ search, setSearch ] = useState(``);

  const filteredNotes = useMemo(
    () => notes?.filter((note) => note.caseNotes?.toLowerCase().includes(search.toLowerCase())),
    [ notes, search ],
  );

  return <Card className="mt-6">
    <CardHeader>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-lg">Previous Notes</CardTitle>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Badge variant="secondary" className="w-fit self-start md:self-auto">
            {filteredNotes?.length} {filteredNotes?.length === 1 ? `note` : `notes`}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {filteredNotes?.length === 0 ?
        <div className="rounded border border-dashed p-8 text-center text-sm text-muted-foreground">
          No matching notes.
        </div> :
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNotes?.map((note) => {
            const sessionDate = note.serviceDate ?
              (typeof note.serviceDate === `string` ?
                parseISO(note.serviceDate) :
                startOfDay(note.serviceDate)).toLocaleDateString() :
              (typeof note.createdAt === `string` ?
                parseISO(note.createdAt) :
                startOfDay(note.createdAt)).toLocaleDateString();

            return <Card key={note.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-xs">
                    District: {note.billingDistrict?.name || `—`} • {sessionDate}
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {note.createdAt ? new Date(note.createdAt).toLocaleTimeString() : ``}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-0">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded bg-muted px-2 py-1">
                    <span className="font-semibold">Direct:</span>
                    {` `}
                    {note.directMinutes}
                  </div>
                  <div className="rounded bg-muted px-2 py-1">
                    <span className="font-semibold">Indirect:</span>
                    {` `}
                    {note.indirectMinutes}
                  </div>
                  <div className="rounded bg-muted px-2 py-1">
                    <span className="font-semibold">Travel:</span>
                    {` `}
                    {note.travelMinutes}
                  </div>
                </div>
                {note.caseNotes ?
                  <div
                    className="rounded border bg-muted/30 p-2 text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(note.caseNotes, {
                        ADD_ATTR: [ `target` ],
                        USE_PROFILES: { html: true },
                      }),
                    }}
                  /> :
                  <span className="text-muted-foreground">No text</span>}
              </CardContent>
            </Card>;
          })}
        </div>}
    </CardContent>
  </Card>;
};

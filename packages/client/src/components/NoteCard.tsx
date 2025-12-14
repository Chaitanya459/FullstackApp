import React from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import DOMPurify from 'dompurify';
import { DocumentationDTO } from 'rsd';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';

interface NoteCardProps {
  children?: React.ReactNode;
  note: DocumentationDTO;
  showDirectMinutes?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  children,
  note,
  showDirectMinutes = true,
}) =>
  <Sheet>
    <div className="w-full rounded-lg border border-border bg-card px-6 py-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium">
              {note.serviceDate ?
                format(
                  typeof note.serviceDate === `string` ? parseISO(note.serviceDate) : startOfDay(note.serviceDate),
                  `EEE dd MMM yyyy`,
                ) :
                `No date`}
            </span>
            <span>•</span>
            <span>
              Written at
              {` `}
              {note.createdAt ?
                format(new Date(note.createdAt), `EEE dd MMM yyyy`) :
                `Unknown`}
            </span>
            {(note.creator?.name || note.therapist?.name) && <>
              <span>•</span>
              <span className="italic">
                {note.creator?.name ?
                  `by ${note.creator.name}` :
                  note.therapist?.name ?
                    `by ${note.therapist.name}` :
                    `by —`}
              </span>
            </>}
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            {showDirectMinutes && <span className="text-foreground">
              <span className="text-muted-foreground">Direct: </span>
              {note.directMinutes}
              {` `}
              Minutes
            </span>}
            <span className="text-foreground">
              <span className="text-muted-foreground">Indirect: </span>
              {note.indirectMinutes}
              {` `}
              Minutes
            </span>
            <span className="text-foreground">
              <span className="text-muted-foreground">Travel: </span>
              {note.travelMinutes}
              {` `}
              Minutes
            </span>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-start justify-between gap-4">
          <div className="line-clamp-2 max-w-3/5 flex-1 text-sm text-foreground">
            {note.caseNotes ?
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(note.caseNotes, {
                    ADD_ATTR: [ `target` ],
                    USE_PROFILES: { html: true },
                  }),
                }}
              /> :
              <span className="text-muted-foreground italic">
                No case notes
              </span>}
          </div>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-xs"
            >
              View
            </Button>
          </SheetTrigger>
        </div>
      </div>
    </div>
    {children}
  </Sheet>;

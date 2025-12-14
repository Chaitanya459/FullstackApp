import React from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import { DocumentationDTO } from 'rsd';
import DOMPurify from 'dompurify';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface NoteSheetProps {
  note: DocumentationDTO;
  sheetTitle?: string;
  showDirectMinutes?: boolean;
}

export const NoteSheet: React.FC<NoteSheetProps> = ({
  note,
  sheetTitle = `Note Details`,
  showDirectMinutes = true,
}) =>
  <SheetContent side="right" className="w-full sm:max-w-lg">
    <SheetHeader className="space-y-3 border-b pb-4">
      <SheetTitle className="text-xl">
        {sheetTitle}
      </SheetTitle>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="font-medium">
          Serviced
          {` `}
          {note.serviceDate ?
            format(
              typeof note.serviceDate === `string` ? parseISO(note.serviceDate) : startOfDay(note.serviceDate),
              `MMMM dd, yyyy`,
            ) :
            `No date`}
        </span>
        <span>•</span>
        <span>
          Documented
          {` `}
          {note.createdAt ?
            format(new Date(note.createdAt), `MMM dd, yyyy`) :
            `Unknown`}
        </span>
      </div>
    </SheetHeader>

    <div className="mt-3 space-y-6 px-1">
      <div className="mx-3 rounded-lg border border-border bg-muted p-4">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Time Tracking
        </h3>
        <div className={`grid gap-4 ${showDirectMinutes ? `grid-cols-3` : `grid-cols-2`}`}>
          {showDirectMinutes && <div>
            <div className="text-xs text-muted-foreground">
              Direct Minutes
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              {note.directMinutes}
            </div>
          </div>}
          <div>
            <div className="text-xs text-muted-foreground">
              Indirect Minutes
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              {note.indirectMinutes}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              Travel Minutes
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              {note.travelMinutes}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="mx-3 mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Case Notes
        </h3>
        <div className="mx-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
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
          </p>
        </div>
      </div>
    </div>
  </SheetContent>;

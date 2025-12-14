import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DocumentationDTO } from 'rsd';
import { parseISO, startOfDay } from 'date-fns';
import { DataTable } from '@/components/data-table';
import { NoteSheet } from '@/components/NoteSheet';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useGetNotes } from '@/services/NoteService';
import { stripHtmlTags } from '@/lib/utils';

interface NotesTabProps {
  therapistId?: number | null;
}

export const NotesTab: React.FC<NotesTabProps> = ({ therapistId = null }) => {
  const { data: therapistNotes = [], isLoading } = useGetNotes(
    { therapistId: therapistId ?? undefined },
    !!therapistId,
  );

  const columnHelper = createColumnHelper<DocumentationDTO>();

  const columns = useMemo(() => [
    columnHelper.accessor(`student`, {
      cell: ({ getValue }) => {
        const student = getValue();
        return student ? `${student.firstName} ${student.lastName}` : `—`;
      },
      enableSorting: true,
      header: `Student Name`,
    }),
    columnHelper.accessor(`caseNotes`, {
      cell: ({ getValue }) => {
        const notes = getValue();
        if (!notes) {
          return `—`;
        }
        const plainText = stripHtmlTags(notes);
        return plainText.length > 100 ? `${plainText.substring(0, 100)}...` : plainText;
      },
      enableSorting: false,
      header: `Note Content`,
    }),
    columnHelper.accessor(`billingDistrict`, {
      cell: ({ getValue }) => {
        const district = getValue();
        return district?.name || `—`;
      },
      enableSorting: false,
      header: `Billing District`,
    }),
    columnHelper.accessor(`serviceDate`, {
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) {
          return `—`;
        }
        const localDate = typeof date === `string` ? parseISO(date) : startOfDay(date);
        return localDate.toLocaleDateString();
      },
      enableSorting: true,
      header: `Service Date`,
    }),
    columnHelper.accessor(`createdAt`, {
      cell: ({ getValue }) => {
        const date = getValue();
        return date ? new Date(date).toLocaleDateString() : `—`;
      },
      enableSorting: true,
      header: `Submission Date`,
    }),
    columnHelper.accessor(`directMinutes`, {
      cell: ({ getValue }) => getValue() || 0,
      enableSorting: true,
      header: `Direct Minutes`,
    }),
    columnHelper.accessor(`travelMinutes`, {
      cell: ({ getValue }) => getValue() || 0,
      enableSorting: true,
      header: `Travel Minutes`,
    }),
    columnHelper.accessor(`indirectMinutes`, {
      cell: ({ getValue }) => getValue() || 0,
      enableSorting: true,
      header: `Indirect Minutes`,
    }),
    columnHelper.accessor(`id`, {
      cell: ({ row }) => {
        const note = row.original;
        return <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="text-blue-600 hover:text-blue-700"
            >
              View
            </Button>
          </SheetTrigger>
          <NoteSheet note={note} sheetTitle="Service Provider Note Details" showDirectMinutes />
        </Sheet>;
      },
      enableSorting: false,
      header: () => `Actions`,
    }),
  ], [ columnHelper ]);

  return <div className="w-full py-5">
    <div className="px-6">
      <DataTable<DocumentationDTO>
        isLoading={isLoading}
        sortable
        noItemsText="No notes available"
        columns={columns}
        data={therapistNotes}
      />
    </div>
  </div>;
};

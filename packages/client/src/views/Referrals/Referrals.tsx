import React, { useMemo } from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { ReferralDTO } from 'rsd';
import { Button } from '@/components/ui/button';
import { useGetReferrals } from '@/services/ReferralService';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table';

export const ReferralList: React.FC = () => {
  const { data: referrals, isError, isLoading } = useGetReferrals();

  const columnHelper = createColumnHelper<ReferralDTO>();

  const columns = useMemo(() => [
    columnHelper.accessor(`studentName`, {
      cell: ({ row }) => <div className="text-center">{row.original.studentName}</div>,
      header: () =>
        <div className="text-center">
          Student Name
        </div>,
    }),
    columnHelper.accessor(`status`, {
      cell: ({ row }) => {
        const { status } = row.original;
        const statusCode = status?.code;
        const statusName = status?.name || `—`;

        const getStatusBadgeClass = () => {
          switch (statusCode) {
            case `DRAFT`:
              return `border-2 border-gray-500 bg-gray-50 px-3 text-sm font-semibold text-gray-700 ` +
                `dark:border-gray-400 dark:bg-gray-800 dark:text-gray-300`;
            case `NEW`:
              return `border-2 border-red-500 bg-red-50 px-3 text-sm font-semibold text-red-700 ` +
                `dark:border-red-400 dark:bg-red-950 dark:text-red-300`;
            case `PENDING_THERAPIST_ASSIGNMENT`:
              return `border-2 border-orange-500 bg-orange-50 px-3 text-sm font-semibold text-orange-700 ` +
                `dark:border-orange-400 dark:bg-orange-950 dark:text-orange-300`;
            case `NEED_INFO`:
              return `border-2 border-pink-500 bg-pink-50 px-3 text-sm font-semibold text-pink-700 ` +
                `dark:border-pink-400 dark:bg-pink-950 dark:text-pink-300`;
            case `PROCESSED`:
              return `border-2 border-green-500 bg-green-50 px-3 text-sm font-semibold text-green-700 ` +
                `dark:border-green-400 dark:bg-green-950 dark:text-green-300`;
            default:
              return `border-2 border-gray-500 bg-gray-50 px-3 text-sm font-semibold text-gray-700 ` +
                `dark:border-gray-400 dark:bg-gray-950 dark:text-gray-300`;
          }
        };

        return <div className="text-center">
          <Badge variant="outline" className={getStatusBadgeClass()}>
            {statusName}
          </Badge>
        </div>;
      },
      header: () =>
        <div className="text-center">
          Status
        </div>,
      sortingFn: (rowA, rowB) => {
        const orderA = rowA.original.status?.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = rowB.original.status?.sortOrder ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      },
    }),
    columnHelper.accessor(`createdAt`, {
      cell: ({ row }) => {
        const { createdAt } = row.original;
        const formattedDate = createdAt ? (() => {
          let dateValue: string | number | Date | undefined;
          if (
            typeof createdAt === `string` ||
              typeof createdAt === `number` ||
              (
                typeof createdAt === `object` &&
                createdAt !== null &&
                (createdAt as object) instanceof Date
              )
          ) {
            dateValue = createdAt;
          }
          return dateValue ?
            new Date(dateValue).toLocaleDateString() :
            `—`;
        })() : `—`;
        return <div className="text-center">{formattedDate}</div>;
      },
      header: () =>
        <div className="text-center">
          Date Created
        </div>,
    }),
    columnHelper.display({
      id: `action`,
      cell: ({ row }) => {
        const { id, status } = row.original;
        const statusCode = status?.code;

        if (statusCode === `DRAFT`) {
          return <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-2 border-blue-500 bg-blue-50 px-6 py-1 text-blue-700 shadow-lg hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <Link to={`/referrals/${id}`}>
                Complete
              </Link>
            </Button>
          </div>;
        }

        if (statusCode === `NEW` || statusCode === `PENDING_THERAPIST_ASSIGNMENT`) {
          return <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-2 border-amber-500 bg-amber-50 px-6 py-1 text-amber-700 shadow-lg hover:bg-amber-100 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
            >
              <Link to={`/referrals/${id}`}>
                Review
              </Link>
            </Button>
          </div>;
        }

        return <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="rounded-lg px-6 py-1 shadow-lg"
          >
            <Link to={`/referrals/${id}`}>
              View
            </Link>
          </Button>
        </div>;
      },
      header: () =>
        <div className="text-center">
          Action
        </div>,
    }),
  ], [ columnHelper ]);

  return <div className="min-h-screen bg-background text-foreground">
    <div className="mt-8 text-center">
      <h1 className="text-2xl font-bold text-foreground">MONTGOMERY COUNTY EDUCATIONAL SERVICE CENTER</h1>
    </div>

    <h1 className="px-4 pt-2 pb-6 text-center text-xl font-bold text-foreground">Specialized and Related Services</h1>

    <div>
      <h1 className="mb-5 text-center text-xl font-bold text-card-foreground">MY REFERRALS</h1>
    </div>

    <div className="mx-10 my-10">
      <DataTable<ReferralDTO>
        columns={columns}
        data={referrals ?? []}
        isLoading={isLoading}
        noItemsText={isError ? `Error loading referrals.` : `No referrals found.`}
        paginate
        sortable
        defaultPageSize={15}
      />
    </div>

    <div className="flex justify-center">
      <Button
        variant="outline"
        size="lg"
        className="text-md mb-6 w-1/4 rounded-xl border-2 border-emerald-600 bg-emerald-100 px-20 py-6 text-center text-emerald-700 shadow-lg hover:bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
      >
        <Link to="/referrals/new">
          <Package size={25} className="mr-2 inline-block" />
          Start a New Referral Package
        </Link>
      </Button>
    </div>
  </div>;
};

export default ReferralList;

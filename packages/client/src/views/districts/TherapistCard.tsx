import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TherapistCardProps {
  caseloadStatus: `Overloaded` | `Full Case Load` | `Underassigned`;
  isExternalProvider?: number | boolean;
  name: string;
  studentsAtDistrict: number;
  title: string;
  totalStudents: number;
}

export const TherapistCard: React.FC<TherapistCardProps> = ({
  caseloadStatus,
  isExternalProvider,
  name,
  studentsAtDistrict,
  title,
  totalStudents,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case `Overloaded`:
        return `bg-red-50 text-red-700 border-red-200`;
      case `Full Case Load`:
        return `bg-amber-50 text-amber-700 border-amber-200`;
      case `Underassigned`:
        return `bg-green-50 text-green-700 border-green-200`;
      default:
        return `bg-gray-50 text-gray-700 border-gray-200`;
    }
  };

  return <Card className="w-full max-w-sm p-0">
    <CardContent className="p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <div className="mt-2 flex flex-col items-center gap-2">
          <Badge
            className={cn(
              `text-xs border`,
              getStatusColor(caseloadStatus),
            )}
          >
            ● {caseloadStatus}
          </Badge>
          {isExternalProvider ?
            <Badge className="flex items-center gap-1 border border-yellow-200 bg-yellow-50 text-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              External Provider
            </Badge> :
            null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="justify-self-start">
          <p className="text-gray-500">Total Students</p>
          <p className="text-lg font-semibold">{totalStudents}</p>
        </div>
        <div className="justify-self-end">
          <p className="text-gray-500">Students at this district</p>
          <p className="text-lg font-semibold">{studentsAtDistrict}</p>
        </div>
      </div>
    </CardContent>
  </Card>;
};

import { useState } from 'react';
import { Download } from 'lucide-react';
import { StudentsTable } from './StudentsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const StudentsTab: React.FC<{ therapistId: number }> = ({ therapistId }) => {
  const [ filterQuery, setFilterQuery ] = useState(``);

  return <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Input
        placeholder="Filter Students"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        className="w-[300px]"
      />
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
    <StudentsTable therapistId={therapistId} filterQuery={filterQuery} />
  </div>;
};

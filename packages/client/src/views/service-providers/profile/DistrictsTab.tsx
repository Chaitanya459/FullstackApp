import { useState } from 'react';
import { Download } from 'lucide-react';
import { DistrictsTable } from './DistrictsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const DistrictsTab: React.FC<{ therapistId?: number }> = ({ therapistId }) => {
  const [ filterQuery, setFilterQuery ] = useState(``);

  return <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Input
        placeholder="Filter Districts"
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.target.value)}
        className="w-[300px]"
      />
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
    <DistrictsTable therapistId={therapistId} filterQuery={filterQuery} />
  </div>;
};

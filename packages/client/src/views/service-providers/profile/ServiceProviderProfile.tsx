import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { NotesTab } from './NotesTab';
import { StudentsTab } from './StudentsTab';
import { DistrictsTab } from './DistrictsTab';
import { ProfileTabs } from '@/components/ProfileTabs';
import { Page } from '@/layout/page';
import { Card, CardContent } from '@/components/ui/card';

type ServiceProviderTab = `students` | `notes` | `districts`;

const RouteIdSchema = z.coerce.number().int().positive();

function validateRouteId(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  try {
    return RouteIdSchema.parse(value);
  } catch {
    return undefined;
  }
}

const ServiceProviderProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ activeTab, setActiveTab ] = useState<ServiceProviderTab>(`notes`);
  const therapistId = useMemo(() => validateRouteId(id), [ id ]);

  const hasInvalidTherapistId = useMemo(() =>
    id && !validateRouteId(id),
  [ id ]);

  return <Page title="Service Provider Record">
    <div className="space-y-4">
      {hasInvalidTherapistId &&
        <Card className="border border-red-300 bg-red-50">
          <CardContent className="px-4 pt-3 !pb-0">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-sm font-medium">Invalid Service Provider ID</span>
            </div>
            <p className="mt-2 text-sm text-red-600">
              The service provider ID "{id}" is not valid.
            </p>
          </CardContent>
        </Card>}

      <Card className="mb-8 border border-gray-300 bg-background">
        <CardContent className="px-4 py-6">
          <div className="text-center text-muted-foreground">
            Service Provider Information Card
          </div>
        </CardContent>
      </Card>

      {therapistId != null &&
        <Card className="p-3">
          <CardContent className="p-0">
            <ProfileTabs<ServiceProviderTab>
              tabs={[
                {
                  content: <StudentsTab therapistId={therapistId} />,
                  label: `Students`,
                  value: `students`,
                },
                {
                  content: <NotesTab therapistId={therapistId} />,
                  label: `Notes`,
                  value: `notes`,
                },
                {
                  content: <DistrictsTab therapistId={therapistId} />,
                  label: `Districts`,
                  value: `districts`,
                },
              ]}
              value={activeTab}
              onValueChange={setActiveTab}
              disableOthers={false}
            />
          </CardContent>
        </Card>}
    </div>
  </Page>;
};

export default ServiceProviderProfile;

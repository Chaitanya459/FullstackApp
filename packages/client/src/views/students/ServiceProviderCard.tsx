import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ExternalLink, Stethoscope, TimerReset, X } from 'lucide-react';
import { StudentServiceAssignmentDTO } from 'rsd';
import { orderBy } from 'lodash';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ServiceProviderCardProps {
  serviceAssignments: StudentServiceAssignmentDTO[];
}

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ serviceAssignments }) => {
  const [ isExpanded, setIsExpanded ] = useState(true);

  return <Collapsible
    open={isExpanded}
    onOpenChange={setIsExpanded}
  >
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        className="flex w-full items-center justify-between rounded-b-none bg-blue-100 p-4 hover:bg-blue-300 dark:bg-gray-800 dark:hover:bg-gray-600"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-black dark:text-white" />
          <h2 className="text-sm font-semibold text-blue-900 dark:text-white">
            Service Providers
          </h2>
        </div>
        {isExpanded ?
          <ChevronUpIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" /> :
          <ChevronDownIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />}
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="py-1">
        <div className="space-y-1">
          {serviceAssignments.length === 0 ?
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No service providers assigned
            </p> :
            orderBy(serviceAssignments, [ `serviceType.code`, `therapist.lastName` ]).map((assignment) =>
              <div
                key={assignment.id}
                className="flex items-start justify-between rounded-sm  bg-blue-100 p-3 transition-colors hover:bg-blue-300 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">
                    {assignment.serviceType?.code}
                  </div>
                  <p className="mt-1 text-xs text-gray-700 dark:text-gray-400">
                    {assignment.therapist?.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="View therapist profile"
                    className="p-0 hover:bg-blue-300 dark:hover:bg-gray-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Temporary Assignment"
                    className="p-0 hover:bg-blue-300 dark:hover:bg-gray-600"
                  >
                    <TimerReset className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 hover:bg-blue-300 hover:text-red-700 dark:hover:bg-gray-600 dark:hover:text-red-300"
                    title="Remove service provider"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>)}
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>;
};

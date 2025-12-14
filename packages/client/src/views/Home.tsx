import { useState } from 'react';
import { Ear, Eye } from 'lucide-react';
import { DocumentationSummaryRange } from 'rsd';
import { NoteMinutesChart } from './Dashboard/NoteMinutesChart';
import { Page } from '@/layout/page';
import { Card } from '@/components/ui/card';
import { useGetNotesSummary } from '@/services/NoteService';
import { useGetServiceTypeReport } from '@/services/ServiceTypeService';

const Home: React.FC = () => {
  const [ visionRange, setVisionRange ] = useState<DocumentationSummaryRange>(`month`);
  const [ hearingRange, setHearingRange ] = useState<DocumentationSummaryRange>(`month`);

  const {
    data: visionSummaryData,
    isLoading: isLoadingVision,
  } = useGetNotesSummary(`VISION`, visionRange, !!visionRange);
  const {
    data: hearingSummaryData,
    isLoading: isLoadingHearing,
  } = useGetNotesSummary(`HEARING`, hearingRange, !!hearingRange);

  const { data: serviceTypeReports } = useGetServiceTypeReport();
  const visionActivitiesData = [
    { activityType: `Direct`, duration: visionSummaryData?.directMinutes ?? 0, fill: `var(--chart-2)` },
    { activityType: `Travel`, duration: visionSummaryData?.travelMinutes ?? 0, fill: `var(--chart-5)` },
    { activityType: `Indirect`, duration: visionSummaryData?.indirectMinutes ?? 0, fill: `var(--chart-4)` },
  ];

  const hearingActivitiesData = [
    { activityType: `Direct`, duration: hearingSummaryData?.directMinutes ?? 0, fill: `var(--chart-2)` },
    { activityType: `Travel`, duration: hearingSummaryData?.travelMinutes ?? 0, fill: `var(--chart-5)` },
    { activityType: `Indirect`, duration: hearingSummaryData?.indirectMinutes ?? 0, fill: `var(--chart-4)` },
  ];

  const summaryCards = (serviceTypeReports ?? []).map((report) => {
    const isVision = report.serviceTypeGroupCode === `VISION`;
    const isHearing = report.serviceTypeGroupCode === `HEARING`;
    return {
      change: `+5.1% from last month`,
      icon: isVision ? <Eye /> : isHearing ? <Ear /> : null,
      label: `${report.serviceTypeCode} Students`,
      value: report.students,
    };
  });

  return <Page title="Dashboard">
    <div className="mx-auto max-w-full space-y-2">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
        {summaryCards.map((card) =>
          <Card key={card.label} className="flex w-full flex-col items-start px-6">
            <div className="flex w-full items-center justify-between gap-4 sm:gap-2 md:gap-2">
              <span className="font-semibold">{card.label}</span>
              <span>{card.icon}</span>
            </div>
            <div>
              <div className="text-3xl font-bold">{card.value}</div>
              <div className="hidden text-xs text-green-600">{card.change}</div>
            </div>
          </Card>)}
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <NoteMinutesChart
        isLoading={isLoadingVision}
        data={visionActivitiesData}
        title="Vision Activities"
        pieDataKey="duration"
        labelDataKey="activityType"
        range={visionRange}
        setRange={setVisionRange}
      />
      <NoteMinutesChart
        isLoading={isLoadingHearing}
        data={hearingActivitiesData}
        title="Hearing Activities"
        pieDataKey="duration"
        labelDataKey="activityType"
        range={hearingRange}
        setRange={setHearingRange}
      />
    </div>
  </Page>;
};
export default Home;

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LabelList, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { DocumentationSummaryRange } from 'rsd';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface NoteMinutesChartProps {
  data: Array<{ activityType: string, duration: number, fill: string }>;
  isLoading?: boolean;
  labelDataKey: string;
  pieDataKey: string;
  range: DocumentationSummaryRange;
  setRange: (value: DocumentationSummaryRange) => void;
  title: string;
}

interface ActivityPayload {
  activityType: string;
  duration: number | string;
  fill: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: ActivityPayload }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const { activityType, duration, fill } = payload[0].payload;

  return <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md">
    <span className="inline-block h-3 w-3 rounded border bg-white" style={{ background: fill }} />
    <span className="text-gray-500">{activityType}</span>
    <span className="ml-2 text-gray-700">{duration}</span>
  </div>;
};

export const NoteMinutesChart: React.FC<NoteMinutesChartProps> = ({
  data,
  isLoading,
  labelDataKey,
  pieDataKey,
  range,
  setRange,
  title,
}) => {
  const total = data.reduce((s, d) => s + Number((d as any)[pieDataKey] ?? 0), 0);

  return <Card className="mt-4 flex flex-col gap-0">
    <CardHeader className="items-center justify-center pb-0">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex min-h-[200px] flex-1 items-center justify-center pb-0">
      <div
        className="mx-auto aspect-square w-full max-w-[400px] [&_.recharts-text]:fill-background"
      >
        {isLoading &&
          <div className="flex h-full min-h-[200px] w-full min-w-[200px] items-center justify-center">
            <Spinner className="size-12" />
          </div>}
        {!isLoading && total === 0 ?
          <div className="flex h-full min-h-[200px] w-full min-w-[200px] items-center justify-center">
            <span className="text-center text-sm text-muted-foreground">No data to display</span>
          </div> :
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={(t) => <CustomTooltip {...(t as any)} />} />
              <Pie data={data} dataKey={pieDataKey}>
                <LabelList
                  dataKey={labelDataKey}
                  className="fill-background"
                  stroke="none"
                  fontSize={14}
                  formatter={(label) => {
                    if (label === null || label === undefined) {
                      return ``;
                    }
                    if (typeof label === `string` || typeof label === `number`) {
                      return String(label);
                    }
                    return ``;
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>}
      </div>
    </CardContent>
    <CardFooter className="flex-col gap-2 text-sm">
      <div className="flex hidden items-center gap-2 leading-none font-medium">
        Direct Time 5.2%
        {` `}
        <TrendingUp className="h-4 w-4" />
      </div>
      <Tabs defaultValue={range} value={range} onValueChange={(value) => setRange(value as DocumentationSummaryRange)} className="mt-2 w-full">
        <TabsList className="flex w-full justify-evenly rounded-md bg-muted">
          <TabsTrigger value="month" className="flex-1 px-3 py-2 text-xs">Last 30 days</TabsTrigger>
          <TabsTrigger value="3months" className=" flex-1 px-3 py-2 text-xs">Last 90 days</TabsTrigger>
          <TabsTrigger value="ytd" className="flex-1 px-3 py-2 text-xs">YTD</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardFooter>
  </Card>;
};

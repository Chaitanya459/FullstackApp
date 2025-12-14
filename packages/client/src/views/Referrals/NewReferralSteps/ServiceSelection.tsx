import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ServiceOption = `hearing` | `vision` | `physical` | `speech`;

export const ServiceSelection: React.FC<{ onSelect?: (service: ServiceOption) => void }> = ({ onSelect }) =>
  <Card className="mx-auto my-[20px] mb-10 max-w-[1500px] space-y-4 rounded-lg border p-[20px] text-center shadow-xl">
    <div>
      <h2 className="mt-5 mb-5 text-center text-xl font-semibold">SELECT A SERVICE TO PROCEED</h2>
    </div>
    <div className="mb-4 block text-center">
      <Button
        variant="outline"
        className="mx-10 mb-8 h-[80px] w-7/8 rounded-xl border-2 border-slate-400 bg-slate-50 py-6 text-lg text-slate-700 shadow-xl hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={() => onSelect?.(`hearing`)}
      >
        <strong>Hearing Intervention:</strong>
        {` `}
        Helping students with hearing impairments access the resources they need.
      </Button>
      <Button
        variant="outline"
        className="mx-10 mb-8 h-[80px] w-7/8 rounded-xl border-2 border-slate-400 bg-slate-50 py-6 text-lg text-slate-700 shadow-xl hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={() => onSelect?.(`vision`)}
      >
        <strong>Vision Intervention:</strong>
        {` `}
        Helping students with visual impairments access the resources they need.
      </Button>
      <Button
        variant="outline"
        className="mx-10 mb-8 h-[80px] w-7/8 rounded-xl border-2 border-slate-400 bg-slate-50 py-6 text-lg text-slate-700 shadow-xl hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={() => onSelect?.(`physical`)}
      >
        <strong>Physical and Occupational Therapy:</strong>
        {` `}
        Helping students develop their sensory-motor and adaptive skills.
      </Button>
      <Button
        variant="outline"
        className="mx-10 mb-8 h-[80px] w-7/8 rounded-xl border-2 border-slate-400 bg-slate-50 py-6 text-lg text-slate-700 shadow-xl hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={() => onSelect?.(`speech`)}
      >
        <strong>Speech-Language Pathology:</strong>
        {` `}
        Enable children to express themselves, understand instructions and engage.
      </Button>
    </div>
  </Card>;

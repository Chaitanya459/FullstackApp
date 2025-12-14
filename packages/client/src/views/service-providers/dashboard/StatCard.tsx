import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) =>
  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
      {icon}
    </div>
  </div>;

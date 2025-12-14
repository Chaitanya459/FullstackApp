import { ReactNode } from 'react';

interface PageProps {
  children?: ReactNode;
  title?: string;
}

export const Page: React.FC<PageProps> = ({ children, title }) =>
  <div className="flex h-full flex-col">
    <main className="flex-1 p-4">
      {title && <h1 className="mb-10 text-3xl font-bold">{title}</h1>}
      {children}
    </main>
  </div>;

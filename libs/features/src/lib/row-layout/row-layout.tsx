import { ReactNode } from 'react';
import Layout from '../layout/layout';

export interface RowLayoutProps {
  children: ReactNode;
}

export function RowLayout({ children }: RowLayoutProps) {
  return <Layout is_eu={false}>{children}</Layout>;
}

export default RowLayout;

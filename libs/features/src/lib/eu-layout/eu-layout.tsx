import { ReactNode } from 'react';
import Layout from '../layout/layout';

export interface EuLayoutProps {
  children: ReactNode;
}

export function EuLayout({ children }: EuLayoutProps) {
  return <Layout is_eu>{children}</Layout>;
}

export default EuLayout;

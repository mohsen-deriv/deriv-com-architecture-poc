import type { HeadFC, PageProps } from 'gatsby';
import { P2p, SeoConfig } from '@deriv-com/pages';
import { EuLayout } from '@deriv-com/features';

const P2PPage: React.FC<PageProps> = () => {
  return (
    <EuLayout>
      <P2p />
    </EuLayout>
  );
};

export default P2PPage;

export const Head: HeadFC = () => <title>{SeoConfig.title}</title>;

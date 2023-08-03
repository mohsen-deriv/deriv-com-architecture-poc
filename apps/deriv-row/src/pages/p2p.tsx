import type { HeadFC, PageProps } from 'gatsby';
import { P2p, SeoConfig } from '@deriv-com/pages';
import { RowLayout } from '@deriv-com/features';

const P2PPage: React.FC<PageProps> = () => {
  return (
    <RowLayout>
      <P2p />
    </RowLayout>
  );
};

export default P2PPage;

export const Head: HeadFC = () => <title>{SeoConfig.title}</title>;

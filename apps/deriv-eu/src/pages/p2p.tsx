import type { HeadFC, PageProps } from 'gatsby';
import { P2p, SeoConfig } from '@deriv-com/pages';

const P2PPage: React.FC<PageProps> = () => {
  return <P2p />;
};

export default P2PPage;

export const Head: HeadFC = () => <title>{SeoConfig.title}</title>;

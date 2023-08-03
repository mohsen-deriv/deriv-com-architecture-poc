import type { HeadFC, PageProps } from 'gatsby';
import { Button } from '@deriv-com/design-system';
import { Layout } from '@deriv-com/features';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout is_eu>
      <main>
        <h1>Deriv Eu</h1>
        <Button
          onClick={() => {
            alert('design system button clicked');
          }}
        >
          This is a design system button
        </Button>
      </main>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;

import type { HeadFC, PageProps } from 'gatsby';
import { Button } from '@deriv-com/design-system';
import { useFoo } from '@deriv-com/hooks';

const IndexPage: React.FC<PageProps> = () => {
  const { count, increment } = useFoo();
  return (
    <main>
      <h1>Deriv Row</h1>
      <h2>count is : {count}</h2>
      <Button onClick={increment}>increment</Button>
      <img src="images/platform_mt5-opt-750.AVIF" alt="yooooloo" />
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;

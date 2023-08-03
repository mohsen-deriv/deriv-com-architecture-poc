import styles from './p2p.module.scss';
import { Button } from '@deriv-com/design-system';

/* eslint-disable-next-line */
export interface P2pProps {}

export function P2p(props: P2pProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to P2p page!</h1>
      <Button>This is a design system button</Button>
    </div>
  );
}

export default P2p;

export const SeoConfig = {
  title: 'P2P',
};

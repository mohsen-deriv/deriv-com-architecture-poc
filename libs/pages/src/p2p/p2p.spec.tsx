import { render } from '@testing-library/react';

import P2p from './p2p';

describe('P2p', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<P2p />);
    expect(baseElement).toBeTruthy();
  });
});

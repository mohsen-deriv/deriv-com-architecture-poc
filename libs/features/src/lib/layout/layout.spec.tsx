import { render } from '@testing-library/react';

import Layout from './layout';

describe('Layout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Layout is_eu />);
    expect(baseElement).toBeTruthy();
  });
});

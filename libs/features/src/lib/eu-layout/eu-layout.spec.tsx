import { render } from '@testing-library/react';

import EuLayout from './eu-layout';

describe('EuLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EuLayout />);
    expect(baseElement).toBeTruthy();
  });
});

import { render } from '@testing-library/react';

import RegionProvider from './region-provider';

describe('RegionProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RegionProvider />);
    expect(baseElement).toBeTruthy();
  });
});

import { render } from '@testing-library/react';

import RowLayout from './row-layout';

describe('RowLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RowLayout />);
    expect(baseElement).toBeTruthy();
  });
});

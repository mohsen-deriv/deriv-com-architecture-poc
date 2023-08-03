import { act, renderHook } from '@testing-library/react';

import useRegion from './use-region';

describe('useRegion', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useRegion());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});

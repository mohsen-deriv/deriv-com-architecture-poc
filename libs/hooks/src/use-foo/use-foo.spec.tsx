import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useFoo from './use-foo';

describe('useFoo', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useFoo());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});

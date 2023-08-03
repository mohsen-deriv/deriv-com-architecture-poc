import { useContext } from 'react';
import { RegionContext } from './region.context';

export function useRegion() {
  const { is_eu } = useContext(RegionContext);

  return {
    is_eu,
  };
}

export default useRegion;

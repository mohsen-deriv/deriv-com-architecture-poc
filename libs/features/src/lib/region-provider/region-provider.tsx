import { RegionContext } from '@deriv-com/hooks';
import type { ReactNode } from 'react';

export interface RegionProviderProps {
  children: ReactNode;
  is_eu: boolean;
}

const RegionProvider = ({ children, is_eu }: RegionProviderProps) => {
  return (
    <RegionContext.Provider
      value={{
        is_eu,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export default RegionProvider;

import React, { ReactNode } from 'react';

interface RegionContextData {
  is_eu: boolean;
}

export const RegionContext = React.createContext<RegionContextData>({
  is_eu: false,
});

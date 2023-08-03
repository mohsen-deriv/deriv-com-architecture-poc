import RegionProvider, {
  RegionProviderProps,
} from '../region-provider/region-provider';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LayoutProps extends RegionProviderProps {}

export function Layout({ children, is_eu }: LayoutProps) {
  return <RegionProvider is_eu={is_eu}>{children}</RegionProvider>;
}

export default Layout;

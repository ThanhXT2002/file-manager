export interface MenuItem {
 label: string;
  icon: string;
  badge?: string;
  children?: MenuItem[];
  action?: () => void;
  route?: string;
  permission?: string;
  routeData?: any;
}

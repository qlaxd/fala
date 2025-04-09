export interface NavigationItem {
  name: string;
  href: string;
  children?: NavigationItem[];
}
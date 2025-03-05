export interface NavbarItems {
  id?: string;
  icon?: string;
  label: string;
  items?: NavbarItems[];
  routerLink?: string;
  permission?: string;
  visible?: boolean;
}

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

const icon = (name: string) => <img src={`/assets/icons/navbar/${name}.png`} style={{ width: 24, height: 24 }} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('dashboard'),
  },
  // {
  //   title: 'User',
  //   path: '/user',
  //   icon: icon('ic-user'),
  // },
  {
    title: 'Product',
    path: '/products',
    icon: icon('add-product'),
    info: (
        <Label color="error" variant="inverted">
          +3
        </Label>
    ),
  },
  {
    title: 'Users',
    path: '/user',
    icon: icon('group'),
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: icon('orders'),
  },
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];

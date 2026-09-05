import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Muhamad Reza',
    email: 'mrezadev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Alecto Admin',
      logo: '/images/logo-light.webp',
      plan: 'Angular + Spartan',
    },
    {
      name: 'Alecto Inc',
      logo: 'lucideGalleryVerticalEnd',
      plan: 'Enterprise',
    },
    {
      name: 'Alecto Corp.',
      logo: 'lucideAudioWaveform',
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: 'lucideLayoutDashboard',
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: 'lucideListTodo',
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: 'lucidePackage',
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: 'lucideMessagesSquare',
        },
        {
          title: 'Users',
          url: '/users',
          icon: 'lucideUsers',
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: 'lucideShieldCheck',
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: 'lucideBug',
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: 'lucideLock',
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: 'lucideUserX',
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: 'lucideFileX',
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: 'lucideServerOff',
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: 'lucideConstruction',
            },
          ],
        },
      ],
    },
    {
      title: 'Components',
      items: [
        {
          title: 'Base UI',
          icon: 'lucideLayers',
          items: [
            {
              title: 'Accordion',
              url: '/components/accordion',
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: 'lucideSettings',
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: 'lucideUserCog',
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: 'lucideWrench',
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: 'lucidePalette',
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: 'lucideBell',
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: 'lucideMonitor',
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: 'lucideHelpCircle',
        },
      ],
    },
  ],
}

import { Routes } from '@angular/router'
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component'
import { AuthenticatedLayoutComponent } from './layouts/authenticated-layout/authenticated-layout.component'

export const routes: Routes = [
  // IMPORTANT: the authenticated shell MUST come before the public auth
  // shell. Both parents use `path: ''`, and an empty-path parent with a
  // component matches `/` even when none of its children match — leaving a
  // blank outlet. With AuthLayout first, `/` rendered AuthLayout ("Alecto
  // Admin") with an empty outlet instead of the dashboard. Authenticated
  // first lets its `path: '' pathMatch: 'full'` dashboard child claim `/`,
  // while non-empty URLs (e.g. `/sign-in`) still fall through to AuthLayout
  // because no authenticated child consumes those segments.
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'apps',
        loadComponent: () =>
          import('./features/apps/apps.component').then((m) => m.AppsComponent),
      },
      {
        path: 'chats',
        loadComponent: () =>
          import('./features/chats/chats.component').then(
            (m) => m.ChatsComponent
          ),
      },
      {
        path: 'help-center',
        loadComponent: () =>
          import('./features/help-center/help-center.component').then(
            (m) => m.HelpCenterComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./features/settings/profile/profile.component').then(
                (m) => m.ProfileComponent
              ),
          },
          {
            path: 'account',
            loadComponent: () =>
              import('./features/settings/account/account.component').then(
                (m) => m.AccountComponent
              ),
          },
          {
            path: 'appearance',
            loadComponent: () =>
              import('./features/settings/appearance/appearance.component').then(
                (m) => m.AppearanceComponent
              ),
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import('./features/settings/notifications/notifications.component').then(
                (m) => m.NotificationsComponent
              ),
          },
          {
            path: 'display',
            loadComponent: () =>
              import('./features/settings/display/display.component').then(
                (m) => m.DisplayComponent
              ),
          },
        ],
      },
      {
        path: 'errors/:error',
        loadComponent: () =>
          import('./features/errors/error-page.component').then(
            (m) => m.ErrorPageComponent
          ),
      },
    ],
  },
  // Public auth shell (sign-in/up, forgot-password, otp).
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./features/auth/sign-in/sign-in.component').then(
            (m) => m.SignInComponent
          ),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./features/auth/sign-up/sign-up.component').then(
            (m) => m.SignUpComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'otp',
        loadComponent: () =>
          import('./features/auth/otp/otp.component').then(
            (m) => m.OtpComponent
          ),
      },
    ],
  },
  // Standalone split-layout sign-in (no AuthLayout shell, like the source).
  {
    path: 'sign-in-2',
    loadComponent: () =>
      import('./features/auth/sign-in-2/sign-in-2.component').then(
        (m) => m.SignIn2Component
      ),
  },
  // Standalone error pages (no shell, like `shadcn-admin/src/routes/(errors)/*`).
  {
    path: '401',
    loadComponent: () =>
      import('./features/errors/unauthorized-error.component').then(
        (m) => m.UnauthorizedErrorComponent
      ),
  },
  {
    path: '403',
    loadComponent: () =>
      import('./features/errors/forbidden-error.component').then(
        (m) => m.ForbiddenErrorComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/errors/not-found-error.component').then(
        (m) => m.NotFoundErrorComponent
      ),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./features/errors/general-error.component').then(
        (m) => m.GeneralErrorComponent
      ),
  },
  {
    path: '503',
    loadComponent: () =>
      import('./features/errors/maintenance-error.component').then(
        (m) => m.MaintenanceErrorComponent
      ),
  },
  // Unknown paths show the 404 page (source-faithful).
  {
    path: '**',
    loadComponent: () =>
      import('./features/errors/not-found-error.component').then(
        (m) => m.NotFoundErrorComponent
      ),
  },
]

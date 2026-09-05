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
        path: 'components/accordion',
        loadComponent: () =>
          import('./features/components/base-ui/accordion/accordion.component').then(
            (m) => m.AccordionComponent,
          ),
      },
      {
        path: 'components/alert',
        loadComponent: () =>
          import('./features/components/base-ui/alert/alert.component').then(
            (m) => m.AlertComponent,
          ),
      },
      {
        path: 'components/alert-dialog',
        loadComponent: () =>
          import(
            './features/components/base-ui/alert-dialog/alert-dialog.component'
          ).then((m) => m.AlertDialogComponent),
      },
      {
        path: 'components/aspect-ratio',
        loadComponent: () =>
          import(
            './features/components/base-ui/aspect-ratio/aspect-ratio.component'
          ).then((m) => m.AspectRatioComponent),
      },
      {
        path: 'components/attachment',
        loadComponent: () =>
          import(
            './features/components/base-ui/attachment/attachment.component'
          ).then((m) => m.AttachmentComponent),
      },
      {
        path: 'components/autocomplete',
        loadComponent: () =>
          import(
            './features/components/base-ui/autocomplete/autocomplete.component'
          ).then((m) => m.AutocompleteComponent),
      },
      {
        path: 'components/avatar',
        loadComponent: () =>
          import('./features/components/base-ui/avatar/avatar.component').then(
            (m) => m.AvatarComponent,
          ),
      },
      {
        path: 'components/badge',
        loadComponent: () =>
          import('./features/components/base-ui/badge/badge.component').then(
            (m) => m.BadgeComponent,
          ),
      },
      {
        path: 'components/breadcrumb',
        loadComponent: () =>
          import(
            './features/components/base-ui/breadcrumb/breadcrumb.component'
          ).then((m) => m.BreadcrumbComponent),
      },
      {
        path: 'components/bubble',
        loadComponent: () =>
          import('./features/components/base-ui/bubble/bubble.component').then(
            (m) => m.BubbleComponent,
          ),
      },
      {
        path: 'components/button',
        loadComponent: () =>
          import('./features/components/base-ui/button/button.component').then(
            (m) => m.ButtonComponent,
          ),
      },
      {
        path: 'components/button-group',
        loadComponent: () =>
          import(
            './features/components/base-ui/button-group/button-group.component'
          ).then((m) => m.ButtonGroupComponent),
      },
      {
        path: 'components/calendar',
        loadComponent: () =>
          import(
            './features/components/base-ui/calendar/calendar.component'
          ).then((m) => m.CalendarComponent),
      },
      {
        path: 'components/card',
        loadComponent: () =>
          import('./features/components/base-ui/card/card.component').then(
            (m) => m.CardComponent,
          ),
      },
      {
        path: 'components/carousel',
        loadComponent: () =>
          import(
            './features/components/base-ui/carousel/carousel.component'
          ).then((m) => m.CarouselComponent),
      },
      {
        path: 'components/chart',
        loadComponent: () =>
          import('./features/components/base-ui/chart/chart.component').then(
            (m) => m.ChartComponent,
          ),
      },
      {
        path: 'components/checkbox',
        loadComponent: () =>
          import(
            './features/components/base-ui/checkbox/checkbox.component'
          ).then((m) => m.CheckboxComponent),
      },
      {
        path: 'components/collapsible',
        loadComponent: () =>
          import(
            './features/components/base-ui/collapsible/collapsible.component'
          ).then((m) => m.CollapsibleComponent),
      },
      {
        path: 'components/combobox',
        loadComponent: () =>
          import(
            './features/components/base-ui/combobox/combobox.component'
          ).then((m) => m.ComboboxComponent),
      },
      {
        path: 'components/command',
        loadComponent: () =>
          import(
            './features/components/base-ui/command/command.component'
          ).then((m) => m.CommandComponent),
      },
      {
        path: 'components/context-menu',
        loadComponent: () =>
          import(
            './features/components/base-ui/context-menu/context-menu.component'
          ).then((m) => m.ContextMenuComponent),
      },
      {
        path: 'components/data-table',
        loadComponent: () =>
          import(
            './features/components/base-ui/data-table/data-table.component'
          ).then((m) => m.DataTableComponent),
      },
      {
        path: 'components/date-picker',
        loadComponent: () =>
          import(
            './features/components/base-ui/date-picker/date-picker.component'
          ).then((m) => m.DatePickerComponent),
      },
      {
        path: 'components/dialog',
        loadComponent: () =>
          import('./features/components/base-ui/dialog/dialog.component').then(
            (m) => m.DialogComponent,
          ),
      },
      {
        path: 'components/drawer',
        loadComponent: () =>
          import('./features/components/base-ui/drawer/drawer.component').then(
            (m) => m.DrawerComponent,
          ),
      },
      {
        path: 'components/dropdown-menu',
        loadComponent: () =>
          import(
            './features/components/base-ui/dropdown-menu/dropdown-menu.component'
          ).then((m) => m.DropdownMenuComponent),
      },
      {
        path: 'components/empty',
        loadComponent: () =>
          import('./features/components/base-ui/empty/empty.component').then(
            (m) => m.EmptyComponent,
          ),
      },
      {
        path: 'components/field',
        loadComponent: () =>
          import('./features/components/base-ui/field/field.component').then(
            (m) => m.FieldComponent,
          ),
      },
      {
        path: 'components/hover-card',
        loadComponent: () =>
          import(
            './features/components/base-ui/hover-card/hover-card.component'
          ).then((m) => m.HoverCardComponent),
      },
      {
        path: 'components/input-group',
        loadComponent: () =>
          import(
            './features/components/base-ui/input-group/input-group.component'
          ).then((m) => m.InputGroupComponent),
      },
      {
        path: 'components/input-otp',
        loadComponent: () =>
          import(
            './features/components/base-ui/input-otp/input-otp.component'
          ).then((m) => m.InputOtpComponent),
      },
      {
        path: 'components/input',
        loadComponent: () =>
          import('./features/components/base-ui/input/input.component').then(
            (m) => m.InputComponent,
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

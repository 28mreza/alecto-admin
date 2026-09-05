import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'

interface Sale {
  readonly name: string
  readonly email: string
  readonly amount: string
  readonly initials: string
  readonly avatar: string
}

const SALES: readonly Sale[] = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    initials: 'OM',
    avatar: '/avatars/01.png',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    initials: 'JL',
    avatar: '/avatars/02.png',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    initials: 'IN',
    avatar: '/avatars/03.png',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    initials: 'WK',
    avatar: '/avatars/04.png',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    initials: 'SD',
    avatar: '/avatars/05.png',
  },
]

@Component({
  selector: 'app-recent-sales',
  standalone: true,
  imports: [HlmAvatarImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      @for (sale of sales; track sale.email) {
        <div class="flex items-center gap-4">
          <hlm-avatar class="h-9 w-9">
            <img hlmAvatarImage [src]="sale.avatar" alt="Avatar" />
            <span hlmAvatarFallback>{{ sale.initials }}</span>
          </hlm-avatar>
          <div class="flex flex-1 flex-wrap items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm leading-none font-medium">{{ sale.name }}</p>
              <p class="text-muted-foreground text-sm">{{ sale.email }}</p>
            </div>
            <div class="font-medium">{{ sale.amount }}</div>
          </div>
        </div>
      }
    </div>
  `,
})
export class RecentSalesComponent {
  protected readonly sales: readonly Sale[] = SALES
}

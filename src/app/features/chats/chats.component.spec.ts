import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import {
  ChatsComponent,
  filterChatList,
  groupMessagesByDate,
} from './chats.component'
import type { ChatUser, Convo } from './data/chat-types'
import { ensureScrollIntoViewStub } from '../../../test-helpers'

const MESSAGES: Convo[] = [
  {
    sender: 'You',
    message: 'See you later!',
    timestamp: '2024-08-24T11:15:15',
  },
  {
    sender: 'Alex',
    message: 'Talk to you later!',
    timestamp: '2024-08-24T11:11:30',
  },
  { sender: 'Alex', message: 'Hey there?', timestamp: '2024-08-23T09:21:05' },
]

const USERS: ChatUser[] = [
  {
    id: 'conv1',
    profile: 'https://example.com/alex.jpg',
    username: 'alex_dev',
    fullName: 'Alex John',
    title: 'Senior Backend Dev',
    messages: MESSAGES,
  },
  {
    id: 'conv2',
    profile: 'https://example.com/taylor.jpg',
    username: 'taylor.codes',
    fullName: 'Taylor Grande',
    title: 'Tech Lead',
    messages: [
      {
        sender: 'Taylor',
        message: 'Hey!',
        timestamp: '2024-08-23T10:30:00',
      },
    ],
  },
]

describe('groupMessagesByDate', () => {
  it('groups messages by formatted date, newest-first', () => {
    const grouped = groupMessagesByDate(MESSAGES)
    expect(Object.keys(grouped)).toEqual(['24 Aug, 2024', '23 Aug, 2024'])
    expect(grouped['24 Aug, 2024']).toHaveLength(2)
    expect(grouped['23 Aug, 2024']).toHaveLength(1)
  })

  it('returns an empty record for no messages', () => {
    expect(groupMessagesByDate([])).toEqual({})
  })
})

describe('filterChatList', () => {
  it('returns all users when the search is blank', () => {
    expect(filterChatList(USERS, '')).toHaveLength(2)
    expect(filterChatList(USERS, '   ')).toHaveLength(2)
  })

  it('matches full names case-insensitively', () => {
    expect(filterChatList(USERS, 'alex').map((u) => u.id)).toEqual(['conv1'])
    expect(filterChatList(USERS, '  TAYLOR ').map((u) => u.id)).toEqual([
      'conv2',
    ])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterChatList(USERS, 'nobody')).toEqual([])
  })
})

describe('ChatsComponent', () => {
  let fixture: ComponentFixture<ChatsComponent>

  beforeEach(async () => {
    document.body.innerHTML = ''
    // ThemeSwitch (via ThemeService) needs matchMedia, which jsdom lacks.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
    window.localStorage.clear()
    // The command list (CDK key manager) calls scrollIntoView on the active
    // item, which jsdom does not implement.
    ensureScrollIntoViewStub()
    await TestBed.configureTestingModule({
      imports: [ChatsComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(ChatsComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  function chatListButton(name: string): HTMLButtonElement {
    const button = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.includes(name)
    ) as HTMLButtonElement | undefined
    expect(button).not.toBeUndefined()
    return button!
  }

  it('renders the inbox heading and the chat list', () => {
    const heading = fixture.nativeElement.querySelector('h1')
    expect(heading?.textContent).toContain('Inbox')
    expect(fixture.nativeElement.textContent).toContain('Alex John')
    expect(fixture.nativeElement.textContent).toContain('Taylor Grande')
  })

  it('shows the empty state before a user is selected', () => {
    expect(fixture.nativeElement.textContent).toContain('Your messages')
    expect(fixture.nativeElement.textContent).toContain(
      'Send a message to start a chat.'
    )
    expect(
      fixture.nativeElement.querySelector(
        'input[placeholder="Type your messages..."]'
      )
    ).toBeNull()
  })

  it('shows the conversation after selecting a user', () => {
    chatListButton('Alex John').click()
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).not.toContain('Your messages')
    expect(
      fixture.nativeElement.querySelector(
        'input[placeholder="Type your messages..."]'
      )
    ).not.toBeNull()
    expect(fixture.nativeElement.textContent).toContain('See you later, Alex!')
  })

  it('opens the new chat dialog from the edit button', async () => {
    const editButton = fixture.nativeElement.querySelector(
      'button[aria-label="New chat"]'
    ) as HTMLButtonElement | null
    expect(editButton).not.toBeNull()
    editButton!.click()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    expect(document.body.textContent).toContain('New message')
  })
})

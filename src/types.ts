export interface Person {
  name: string;
  email: string;
  avatar: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  isPrimary?: boolean;
}

export interface Label {
  id: string;
  name: string;
  system: boolean;
  color: string | null;
}

export interface Attachment {
  name: string;
  size: string;
}

export interface EmailImage {
  alt: string;
  gradient: string;
  isMore?: boolean;
  count?: number;
}

export interface Email {
  id: string;
  subject: string;
  from: Person;
  to: Person[];
  account: string;
  threadId: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  timestamp: string;
  preview: string;
  body?: string;
  images?: EmailImage[];
  smartReplies?: string[];
  attachmentLabel?: string | null;
  attachments?: Attachment[];
  isSpamDetected?: boolean;
}

export interface UndoAction {
  type: 'archive' | 'trash' | 'move' | 'markRead';
  emails: Email[];
  label?: string;
  isRead?: boolean;
}

export interface ComposeWindowData {
  id: string;
  to: string;
  subject: string;
  body: string;
  cc: string;
  bcc: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  duration: number;
  undoAction?: string | null;
  retryAction?: (() => void) | null;
  exiting: boolean;
}

export interface ConfirmDialogConfig {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  dangerous?: boolean;
}

export interface UserPreferences {
  density: 'compact' | 'comfortable' | 'spacious';
  theme: 'light' | 'dark';
  zoom: number; // percentage 70–150, default 100
  keyboardShortcutsEnabled: boolean;
  customShortcuts: Record<string, string>;
}

export interface ShortcutDef {
  id: string;
  category: string;
  description: string;
  defaultKey: string;
  twoKey: boolean;
}

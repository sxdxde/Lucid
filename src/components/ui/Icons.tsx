// HCI: P4 Dual-Coding — custom icons pair with text for recognition
// HCI: G6 Similarity — consistent icon style (20x20 stroke, 1.5px)
// HCI: D6 Affordance — icons designed to signal their function
import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

interface IconStarProps extends IconProps {
  filled?: boolean;
}

export function IconInbox({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13l2-8h12l2 8H2z" />
      <path d="M2 13h3.5l1 2h7l1-2H18" />
    </svg>
  );
}

export function IconStar({ className = 'w-4 h-4', filled = false, style }: IconStarProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l2.39 4.84L18 7.64l-4 3.9.94 5.5L10 14.27 5.06 17.04 6 11.54 2 7.64l5.61-.8L10 2z" />
    </svg>
  );
}

export function IconSend({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2L9 11" />
      <path d="M18 2L12 18l-3-7-7-3 16-6z" />
    </svg>
  );
}

export function IconDraft({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V2z" />
      <path d="M14 2v4h-4" />
      <path d="M13 9l1.5 1.5L11 14H9.5v-1.5L13 9z" />
    </svg>
  );
}

export function IconMail({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <path d="M2 7l8 5 8-5" />
    </svg>
  );
}

export function IconMailOpen({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8.5L10 4l8 4.5V17a1 1 0 01-1 1H3a1 1 0 01-1-1V8.5z" />
      <path d="M2 8.5l8 4.5 8-4.5" />
    </svg>
  );
}

export function IconSpam({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l7.5 4.5v7L10 18l-7.5-4.5v-7L10 2z" />
      <path d="M10 7v4M10 13h.01" />
    </svg>
  );
}

export function IconAlertTriangle({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.574 2.5a1.6 1.6 0 012.852 0l6.574 12A1.6 1.6 0 0116.574 17H3.426a1.6 1.6 0 01-1.426-2.5l6.574-12z" />
      <path d="M10 8v3M10 13.5h.01" />
    </svg>
  );
}

export function IconTrash({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h14M8 6V4h4v2M7 6l1 11h4l1-11" />
    </svg>
  );
}

export function IconSearch({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6" />
      <path d="M13.5 13.5L17 17" />
    </svg>
  );
}

export function IconCompose({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16l9-9 3 3-9 9H4v-3z" />
      <path d="M13 3l3 3-1 1-3-3 1-1z" />
    </svg>
  );
}

export function IconSettings({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {/* Sliders / controls icon — clearly not a sun */}
      <path d="M3 5.5h3.5" /><circle cx="8" cy="5.5" r="2" /><path d="M10 5.5h7" />
      <path d="M3 10h7.5" /><circle cx="12.5" cy="10" r="2" /><path d="M14.5 10h2.5" />
      <path d="M3 14.5h2.5" /><circle cx="7" cy="14.5" r="2" /><path d="M9 14.5h8" />
    </svg>
  );
}

export function IconChevronDown({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

export function IconChevronRight({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 5l5 5-5 5" />
    </svg>
  );
}

export function IconChevronLeft({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 5l-5 5 5 5" />
    </svg>
  );
}

export function IconChevronUp({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l5-5 5 5" />
    </svg>
  );
}

export function IconArchive({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v1H2V5zM2 8h16v9a1 1 0 01-1 1H3a1 1 0 01-1-1V8z" />
      <path d="M8 12h4" />
    </svg>
  );
}

export function IconReply({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5L3 10l5 5" />
      <path d="M3 10h8a6 6 0 016 6" />
    </svg>
  );
}

export function IconReplyAll({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5L1 9l4 4" />
      <path d="M10 5L6 9l4 4" />
      <path d="M6 9h8a4 4 0 014 4" />
    </svg>
  );
}

export function IconForward({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5l5 5-5 5" />
      <path d="M17 10H9a6 6 0 00-6 6" />
    </svg>
  );
}

export function IconAttachment({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 9l-5.5 5.5a4 4 0 01-5.66-5.66l6.36-6.36a2.5 2.5 0 013.54 3.54L8.4 12.35a1 1 0 01-1.41-1.41L12.5 5.5" />
    </svg>
  );
}

export function IconClose({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  );
}

export function IconMinimize({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12" />
    </svg>
  );
}

export function IconMaximize({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="12" height="12" rx="1" />
      <path d="M4 8h12M8 4v12" />
    </svg>
  );
}

export function IconMinimize2({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v4h4M4 16l7-7M4 8H8V4M16 12h-4v4" />
    </svg>
  );
}

export function IconArrowLeft({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4l-6 6 6 6M3 10h14" />
    </svg>
  );
}

export function IconPlus({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function IconTag({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 2.5h6l9 9-6 6-9-9v-6z" />
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconGrip({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r=".5" fill="currentColor" />
      <circle cx="7" cy="10" r=".5" fill="currentColor" />
      <circle cx="7" cy="13" r=".5" fill="currentColor" />
      <circle cx="11" cy="7" r=".5" fill="currentColor" />
      <circle cx="11" cy="10" r=".5" fill="currentColor" />
      <circle cx="11" cy="13" r=".5" fill="currentColor" />
    </svg>
  );
}

export function IconCheck({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l5 5L17 5" />
    </svg>
  );
}

export function IconAlertCircle({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 6v4M10 13h.01" />
    </svg>
  );
}

export function IconLogOut({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4h4v12h-4M8 14l4-4-4-4M2 10h10" />
    </svg>
  );
}

export function IconKeyboard({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="16" height="10" rx="2" />
      <path d="M6 9h1M9 9h1M12 9h1M6 12h8M15 9h1" />
    </svg>
  );
}

export function IconEye({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" />
      <circle cx="10" cy="10" r="2" />
    </svg>
  );
}

export function IconEyeOff({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l14 14M8.6 8.6a2 2 0 002.8 2.8" />
      <path d="M17.5 10A8.5 8.5 0 0110 15a8.18 8.18 0 01-2.5-.5M10 5a8.5 8.5 0 017.5 5 8.7 8.7 0 01-1.5 2.5" />
    </svg>
  );
}

export function IconBold({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h5a3 3 0 010 6H6V4zM6 10h6a3 3 0 010 6H6V10z" />
    </svg>
  );
}

export function IconItalic({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4h4M5 16h4M12 4L8 16" />
    </svg>
  );
}

export function IconUnderline({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4v6a3 3 0 006 0V4M4 17h12" />
    </svg>
  );
}

export function IconLink({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 11.5a4.5 4.5 0 006.36 0l2-2a4.5 4.5 0 00-6.36-6.36l-1 1" />
      <path d="M11.5 8.5a4.5 4.5 0 00-6.36 0l-2 2a4.5 4.5 0 006.36 6.36l1-1" />
    </svg>
  );
}

export function IconList({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="4" cy="6" r=".5" fill="currentColor" />
      <circle cx="4" cy="10" r=".5" fill="currentColor" />
      <circle cx="4" cy="14" r=".5" fill="currentColor" />
      <path d="M8 6h9M8 10h9M8 14h9" />
    </svg>
  );
}

export function IconQuote({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor">
      <path d="M4.5 6A2.5 2.5 0 002 8.5v1A2.5 2.5 0 004.5 12h.5a2 2 0 01-2 2v1a3 3 0 003-3V8.5A2.5 2.5 0 004.5 6zM13 6a2.5 2.5 0 00-2.5 2.5v1A2.5 2.5 0 0013 12h.5a2 2 0 01-2 2v1a3 3 0 003-3V8.5A2.5 2.5 0 0013 6z" />
    </svg>
  );
}

export function IconMoreHorizontal({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor">
      <circle cx="5" cy="10" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="15" cy="10" r="1.5" />
    </svg>
  );
}

export function IconNoEmail({ className = 'w-16 h-16', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="16" width="48" height="34" rx="4" stroke="#d1d5db" />
      <path d="M8 24l24 15 24-15" stroke="#d1d5db" />
      <path d="M26 36l-18 14M38 36l18 14" stroke="#e5e7eb" />
    </svg>
  );
}

export function IconNoSearch({ className = 'w-16 h-16', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="28" r="18" stroke="#d1d5db" />
      <path d="M41 41l14 14" stroke="#d1d5db" />
      <path d="M22 22l12 12M34 22L22 34" stroke="#e5e7eb" />
    </svg>
  );
}

export function IconGmail({ className = 'w-6 h-6', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2h24v18H2z" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
      <path d="M2 2l12 10L26 2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="0" y="0" width="4" height="22" rx="1" fill="#e2e8f0"/>
      <rect x="24" y="0" width="4" height="22" rx="1" fill="#e2e8f0"/>
    </svg>
  );
}

export function IconGmailM({ size = 32, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 28" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="4" width="32" height="24" rx="2" fill="white" />
      <rect x="0" y="4" width="3" height="24" rx="1" fill="#EA4335" />
      <rect x="29" y="4" width="3" height="24" rx="1" fill="#34A853" />
      <rect x="0" y="26" width="32" height="2" rx="1" fill="#FBBC04" />
      <path d="M0 6 L16 18 L0 6Z" fill="#4285F4" />
      <path d="M0 6 L16 18 L32 6" stroke="#4285F4" strokeWidth="2" fill="none" />
      <path d="M0 6 L0 28 L3 28 L3 6Z" fill="#EA4335" />
      <path d="M29 6 L29 28 L32 28 L32 6Z" fill="#34A853" />
    </svg>
  );
}

export function GmailLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="36" height="26" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
      <rect x="2" y="2" width="4" height="26" rx="1" fill="#EA4335"/>
      <rect x="34" y="2" width="4" height="26" rx="1" fill="#34A853"/>
      <rect x="2" y="25" width="36" height="3" rx="1" fill="#FBBC04"/>
      <path d="M6 4 L20 16 L34 4" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function IconReadCircle({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M7 10l2 2 4-4" />
    </svg>
  );
}

export function IconUnreadDot({ className = 'w-2 h-2', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}

export function IconExternalLink({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4h4v4M11 9l5-5M4 6h5M4 10v6h12v-5" />
    </svg>
  );
}

export function IconVideo({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="11" height="10" rx="2" />
      <path d="M13 8l5-2v8l-5-2V8z" />
    </svg>
  );
}

export function IconVideoPlus({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="9" height="8" rx="2" />
      <path d="M11 9l5-2v6l-5-2V9z" />
      <path d="M5.5 9v2M4.5 10h2" />
    </svg>
  );
}

export function IconBell({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2a6 6 0 016 6v3l2 2H2l2-2V8a6 6 0 016-6z" />
      <path d="M8.5 16a1.5 1.5 0 003 0" />
    </svg>
  );
}

export function IconHelpCircle({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M7.5 7.5a2.5 2.5 0 015 .83c0 1.67-2.5 2.5-2.5 2.5" />
      <path d="M10 14h.01" />
    </svg>
  );
}

export function IconGrid({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor">
      <rect x="3" y="3" width="4" height="4" rx="1" />
      <rect x="8.5" y="3" width="4" height="4" rx="1" />
      <rect x="14" y="3" width="3" height="4" rx="1" />
      <rect x="3" y="8.5" width="4" height="4" rx="1" />
      <rect x="8.5" y="8.5" width="4" height="4" rx="1" />
      <rect x="14" y="8.5" width="3" height="4" rx="1" />
      <rect x="3" y="14" width="4" height="3" rx="1" />
      <rect x="8.5" y="14" width="4" height="3" rx="1" />
      <rect x="14" y="14" width="3" height="3" rx="1" />
    </svg>
  );
}

export function IconChat({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 9.5c0 3.59-3.13 6.5-7 6.5a7.44 7.44 0 01-3.5-.87L3 17l1.5-3A6.13 6.13 0 013 9.5C3 5.91 6.13 3 10 3s7 2.91 7 6.5z" />
    </svg>
  );
}

export function IconSnooze({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function IconColor({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="currentColor">
      <circle cx="10" cy="10" r="6" />
    </svg>
  );
}

export function IconLock({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="12" height="9" rx="2" />
      <path d="M7 9V6a3 3 0 016 0v3" />
    </svg>
  );
}

export function IconSignature({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17c1-3 2-5 4-6s3 1 2 3 1 3 3 1 3-4 5-5" />
    </svg>
  );
}

export function IconAlignLeft({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 5h14M3 9h9M3 13h12M3 17h7" />
    </svg>
  );
}

export function IconCopy({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M3 13V5a2 2 0 012-2h8" />
    </svg>
  );
}

export function IconTask({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="12" height="14" rx="2" />
      <path d="M7 8h6M7 11h4M7 14h3" />
      <path d="M7 5l1 1 2-2" />
    </svg>
  );
}

// HCI: D6 Affordance — circular arrow universally signals "refresh / reload"
// HCI: S3 Informative Feedback — icon spins during reload to signal system activity
export function IconRefresh({ className = 'w-4 h-4', style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 10a7 7 0 11-1.5-4.33" />
      <path d="M17 2v4h-4" />
    </svg>
  );
}

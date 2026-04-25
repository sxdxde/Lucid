// HCI: N2 Match Real World — familiar chat bubble layout
// HCI: S3 Informative Feedback — typing indicator before bot reply
// HCI: N3 User Control — always-visible close button
// HCI: G3 Proximity — message time close to bubble
import React, { useState, useEffect, useRef } from 'react';
import { useUiStore } from '../../stores/uiStore';
import { Avatar } from '../ui/Avatar';
import { IconClose } from '../ui/Icons';
import type { Person } from '../../types';

const BOT_REPLIES = [
  "That makes sense. Let me look into it.",
  "Sure, I can help with that.",
  "Got it. I will get back to you shortly.",
  "Thanks for the update!",
  "Sounds good to me.",
  "Can we discuss this on the call tomorrow?",
  "I am on it.",
  "Will do!",
  "Noted, thanks.",
  "Let me check and confirm.",
  "Interesting point — I will think about it.",
  "Makes sense. I agree.",
  "Leave it with me.",
  "On it right away.",
  "Good idea, let's go with that.",
];

interface ChatMessage {
  id: number;
  from: 'me' | 'them';
  text: string;
  ts: number;
  avatar?: string;
  color?: string;
}

function formatChatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isMe = msg.from === 'me';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMe ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginBottom: 12,
      }}
    >
      {!isMe && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: msg.color ?? '#6366f1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.625rem', fontWeight: 700, color: 'white', flexShrink: 0,
        }}>
          {msg.avatar ?? '?'}
        </div>
      )}
      <div style={{ maxWidth: '72%' }}>
        <div
          style={{
            padding: '10px 14px',
            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: isMe ? 'var(--brand-500)' : 'var(--gray-100)',
            color: isMe ? 'white' : 'var(--text-primary)',
            fontSize: '.875rem',
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {msg.text}
        </div>
        <p style={{
          margin: '3px 0 0',
          fontSize: '.6875rem',
          color: 'var(--text-muted)',
          textAlign: isMe ? 'right' : 'left',
        }}>
          {formatChatTime(msg.ts)}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator({ contact }: { contact: Person }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: contact?.color ?? '#6366f1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '.625rem', fontWeight: 700, color: 'white', flexShrink: 0,
      }}>
        {contact?.avatar ?? '?'}
      </div>
      <div style={{
        padding: '12px 16px',
        borderRadius: '18px 18px 18px 4px',
        background: 'var(--gray-100)',
        display: 'flex',
        gap: 4,
        alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--gray-400)',
            animation: `chat-dot .9s ease-in-out ${i * 0.18}s infinite`,
            display: 'inline-block',
          }} />
        ))}
      </div>
    </div>
  );
}

export function Chat() {
  const { chatOpen, chatContact, closeChat } = useUiStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!chatContact) return;
    setMessages([
      {
        id: 1,
        from: 'them',
        text: `Hey! What's up?`,
        ts: Date.now() - 2 * 60 * 1000,
        avatar: chatContact.avatar,
        color: chatContact.color,
      },
    ]);
    setInput('');
    setTyping(false);
  }, [chatContact?.email]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [chatOpen]);

  const composeWindows = useUiStore(s => s.composeWindows);
  const chatRight = composeWindows.length > 0
    ? 16 + composeWindows.length * (548 + 8) + 16
    : 16;

  if (!chatOpen || !chatContact) return null;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: Date.now(), from: 'me', text, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'them',
          text: reply,
          ts: Date.now(),
          avatar: chatContact.avatar,
          color: chatContact.color,
        },
      ]);
      setTyping(false);
    }, delay);
  };

  return (
    <div
      className="chat-panel fade-up"
      style={{ right: chatRight }}
      role="dialog"
      aria-label={`Chat with ${chatContact.name}`}
      aria-modal="false"
    >
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar person={chatContact} size="md" />
          <div>
            <p style={{ margin: 0, fontSize: '.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {chatContact.name}
            </p>
            <p style={{ margin: 0, fontSize: '.6875rem', color: 'var(--success)', fontWeight: 500 }}>
              Active now
            </p>
          </div>
        </div>
        <button
          className="icon-btn"
          onClick={closeChat}
          aria-label="Close chat"
          style={{ color: 'var(--text-muted)' }}
        >
          <IconClose className="w-4 h-4" />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        {typing && <TypingIndicator contact={chatContact} />}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder={`Message ${chatContact.name.split(' ')[0]}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          aria-label="Type a message"
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}

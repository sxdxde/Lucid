// HCI: N10 Help & Documentation — tooltips provide context-sensitive help
// HCI: SP3 Unobtrusiveness — tooltips don't interrupt workflow
import React, { useState, useRef } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

export function Tooltip({ children, content, side = 'bottom', disabled }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  if (!content || disabled) return <>{children}</>;

  const show = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 6;
    let x = 0, y = 0;
    if (side === 'bottom') {
      x = rect.left + rect.width / 2;
      y = rect.bottom + gap;
    } else if (side === 'top') {
      x = rect.left + rect.width / 2;
      y = rect.top - gap;
    } else if (side === 'right') {
      x = rect.right + gap;
      y = rect.top + rect.height / 2;
    } else {
      x = rect.left - gap;
      y = rect.top + rect.height / 2;
    }
    setPos({ x, y });
    setVisible(true);
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onFocus={show}
        onBlur={() => setVisible(false)}
        style={{ display: 'contents' }}
      >
        {children}
      </span>
      {visible && (
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            zIndex: 99999,
            ...(side === 'bottom' && { left: pos.x, top: pos.y, transform: 'translateX(-50%)' }),
            ...(side === 'top'    && { left: pos.x, bottom: `calc(100vh - ${pos.y}px)`, transform: 'translateX(-50%)' }),
            ...(side === 'right'  && { left: pos.x, top: pos.y, transform: 'translateY(-50%)' }),
            ...(side === 'left'   && { right: `calc(100vw - ${pos.x}px)`, top: pos.y, transform: 'translateY(-50%)' }),
            pointerEvents: 'none',
          }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  );
}

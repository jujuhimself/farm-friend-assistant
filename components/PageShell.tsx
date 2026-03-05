import React, { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  titleColor?: string;
  rightContent?: ReactNode;
  noPadding?: boolean;
  maxWidth?: string;
}

/**
 * Standardized page wrapper with consistent padding, max-width, and mobile-safe spacing.
 * Every view should use this to guarantee layout parity across environments.
 */
const PageShell: React.FC<PageShellProps> = ({
  children,
  title,
  subtitle,
  titleColor,
  rightContent,
  noPadding = false,
  maxWidth = '1400px',
}) => {
  return (
    <div
      className={`min-h-[calc(100vh-3.5rem)] pb-20 lg:pb-8 ${noPadding ? '' : 'px-3 md:px-6 py-4 md:py-8'}`}
      style={{ maxWidth, marginLeft: 'auto', marginRight: 'auto' }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4 md:mb-8 border-b border-border pb-4 md:pb-6">
        <div className="min-w-0">
          <h1 className={`text-xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase leading-none mb-1 ${titleColor || ''}`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-text-muted font-mono text-[9px] md:text-[10px] uppercase tracking-widest truncate">
              {subtitle}
            </p>
          )}
        </div>
        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </div>

      {/* Content */}
      <div className="min-w-0">{children}</div>
    </div>
  );
};

export default PageShell;

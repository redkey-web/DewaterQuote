'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AutoSizeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  minWidth?: number;
  maxWidth?: number;
}

const AutoSizeInput = React.forwardRef<HTMLInputElement, AutoSizeInputProps>(
  ({ className, value, placeholder, minWidth = 60, maxWidth = 500, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const sizerRef = React.useRef<HTMLSpanElement>(null);
    const [inputWidth, setInputWidth] = React.useState<number>(minWidth);

    // Calculate width based on content
    React.useLayoutEffect(() => {
      if (sizerRef.current) {
        // Get computed styles from container for accurate measurement
        const computed = window.getComputedStyle(sizerRef.current);
        const textContent = String(value || '') || placeholder || '';
        sizerRef.current.textContent = textContent;

        // Measure the text width
        const textWidth = sizerRef.current.scrollWidth;
        // Add padding (px-3 = 12px each side = 24px total) + some buffer
        const newWidth = Math.max(minWidth, Math.min(maxWidth, textWidth + 32));
        setInputWidth(newWidth);
      }
    }, [value, placeholder, minWidth, maxWidth]);

    return (
      <div ref={containerRef} className="relative inline-flex items-center">
        {/* Hidden sizer element - must match input styles exactly */}
        <span
          ref={sizerRef}
          className={cn(
            'absolute invisible whitespace-pre pointer-events-none',
            // Match the text styling from className
            className?.includes('font-mono') && 'font-mono',
            className?.includes('uppercase') && 'uppercase',
            className?.includes('text-xs') ? 'text-xs' : 'text-sm'
          )}
          style={{
            left: 0,
            top: 0,
          }}
          aria-hidden="true"
        />
        <input
          ref={ref}
          value={value}
          placeholder={placeholder}
          className={cn(
            'flex rounded-md border border-input bg-background px-3 py-1 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          style={{ width: `${inputWidth}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px` }}
          {...props}
        />
      </div>
    );
  }
);

AutoSizeInput.displayName = 'AutoSizeInput';

export { AutoSizeInput };

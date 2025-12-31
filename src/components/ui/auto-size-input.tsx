'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AutoSizeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  minWidth?: number;
  maxWidth?: number;
}

const AutoSizeInput = React.forwardRef<HTMLInputElement, AutoSizeInputProps>(
  ({ className, value, placeholder, minWidth = 60, maxWidth = 400, ...props }, ref) => {
    const [width, setWidth] = React.useState(minWidth);
    const measureRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
      if (measureRef.current) {
        const textToMeasure = String(value || placeholder || '');
        measureRef.current.textContent = textToMeasure || 'W'; // 'W' as fallback for empty
        const measuredWidth = measureRef.current.offsetWidth + 24; // Add padding
        setWidth(Math.max(minWidth, Math.min(maxWidth, measuredWidth)));
      }
    }, [value, placeholder, minWidth, maxWidth]);

    return (
      <div className="relative inline-block">
        {/* Hidden span for measuring text width */}
        <span
          ref={measureRef}
          className={cn(
            'invisible absolute whitespace-pre',
            className
          )}
          style={{
            font: 'inherit',
            padding: 0,
            border: 0,
          }}
          aria-hidden="true"
        />
        <input
          ref={ref}
          value={value}
          placeholder={placeholder}
          className={cn(
            'flex h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          style={{ width: `${width}px` }}
          {...props}
        />
      </div>
    );
  }
);

AutoSizeInput.displayName = 'AutoSizeInput';

export { AutoSizeInput };

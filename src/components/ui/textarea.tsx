import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, maxLength, id, value, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(
      typeof value === 'string' ? value.length : 0
    );

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm',
            'placeholder:text-gray-400 text-gray-900',
            'bg-gray-50/50 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white',
            'hover:border-gray-300',
            'transition-all duration-200',
            error && 'border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30',
            className
          )}
          value={value}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e);
          }}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {error ? (
            <p className="text-xs font-medium text-red-600">{error}</p>
          ) : (
            <div />
          )}
          {maxLength && (
            <p
              className={cn(
                'text-xs font-medium',
                charCount > maxLength ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export { Textarea };

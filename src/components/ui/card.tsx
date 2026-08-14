import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

function Card({ className, hover, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100/80',
        hover && 'hover:shadow-lg hover:border-gray-200/80 hover:-translate-y-0.5 transition-all duration-300',
        glow && 'animate-[glow_3s_ease-in-out_infinite]',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={cn('px-6 py-5 border-b border-gray-100', className)} {...props} />
  );
}

function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3 className={cn('text-lg font-bold text-gray-900', className)} {...props} />
  );
}

function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}

function CardFooter({ className, ...props }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl', className)} {...props} />
  );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter };

import React from 'react';

interface RoseGardenTitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RoseGardenTitle({ 
  children, 
  size = 'md', 
  className = '' 
}: RoseGardenTitleProps) {
  const sizeClasses = {
    sm: 'title-rose-garden-sm',
    md: 'title-rose-garden',
    lg: 'title-rose-garden-lg'
  };

  return (
    <h1 className={`${sizeClasses[size]} ${className}`}>
      {children}
    </h1>
  );
}

// También puedes usar directamente las clases de Tailwind:
// className="font-rose-garden text-4xl"
// className="font-rose-garden text-2xl"
// className="font-rose-garden text-6xl"

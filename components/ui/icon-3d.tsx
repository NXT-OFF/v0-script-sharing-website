'use client';

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Icon3DProps {
  icon: LucideIcon;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'info';
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28',
};

const iconSizes = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-10 w-10',
  xl: 'h-14 w-14',
};

const variantStyles = {
  primary: {
    bg: 'bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10',
    border: 'border-primary/40',
    shadow: 'shadow-[0_8px_30px_-5px] shadow-primary/30',
    icon: 'text-primary',
    glow: 'after:bg-primary/20',
  },
  accent: {
    bg: 'bg-gradient-to-br from-accent/30 via-accent/20 to-accent/10',
    border: 'border-accent/40',
    shadow: 'shadow-[0_8px_30px_-5px] shadow-accent/30',
    icon: 'text-accent',
    glow: 'after:bg-accent/20',
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-500/30 via-emerald-500/20 to-emerald-500/10',
    border: 'border-emerald-500/40',
    shadow: 'shadow-[0_8px_30px_-5px] shadow-emerald-500/30',
    icon: 'text-emerald-400',
    glow: 'after:bg-emerald-500/20',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-500/30 via-amber-500/20 to-amber-500/10',
    border: 'border-amber-500/40',
    shadow: 'shadow-[0_8px_30px_-5px] shadow-amber-500/30',
    icon: 'text-amber-400',
    glow: 'after:bg-amber-500/20',
  },
  info: {
    bg: 'bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-blue-500/10',
    border: 'border-blue-500/40',
    shadow: 'shadow-[0_8px_30px_-5px] shadow-blue-500/30',
    icon: 'text-blue-400',
    glow: 'after:bg-blue-500/20',
  },
};

export function Icon3D({ icon: Icon, className, size = 'md', variant = 'primary' }: Icon3DProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-2xl border backdrop-blur-sm',
        'transform transition-all duration-300 hover:scale-105 hover:-translate-y-1',
        'after:absolute after:inset-0 after:rounded-2xl after:blur-xl after:-z-10 after:opacity-50',
        sizeClasses[size],
        styles.bg,
        styles.border,
        styles.shadow,
        styles.glow,
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none"
        style={{
          transform: 'translateZ(2px)',
        }}
      />
      <Icon
        className={cn(iconSizes[size], styles.icon, 'drop-shadow-lg')}
        style={{
          transform: 'translateZ(10px)',
        }}
      />
    </div>
  );
}

// Category specific 3D icons
import {
  Code,
  Map,
  Wrench,
  Monitor,
  Shirt,
  Database,
  Upload,
  Download,
  Star,
  Trophy,
  Users,
  Shield,
} from 'lucide-react';

export function ScriptIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Code} size={size} variant="primary" />;
}

export function MappingIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Map} size={size} variant="success" />;
}

export function ToolIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Wrench} size={size} variant="warning" />;
}

export function LoadingScreenIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Monitor} size={size} variant="accent" />;
}

export function OutfitIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Shirt} size={size} variant="info" />;
}

export function BaseIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Database} size={size} variant="primary" />;
}

export function UploadIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Upload} size={size} variant="primary" />;
}

export function DownloadIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Download} size={size} variant="success" />;
}

export function StarIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Star} size={size} variant="warning" />;
}

export function TrophyIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Trophy} size={size} variant="warning" />;
}

export function UsersIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Users} size={size} variant="info" />;
}

export function ShieldIcon3D({ size = 'md' }: { size?: Icon3DProps['size'] }) {
  return <Icon3D icon={Shield} size={size} variant="accent" />;
}

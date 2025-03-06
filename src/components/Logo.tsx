'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  // Optional className for additional styling
  className?: string;
  // Optional size variant
  size?: 'sm' | 'md' | 'lg';
  // Optional link - if not provided, logo will be rendered without a link
  href?: string;
  // Optional flag to show only the image
  imageOnly?: boolean;
}

export default function Logo({ className = '', size = 'md', href, imageOnly = false }: LogoProps) {
  // Define size variants for both the text and image
  const sizeClasses = {
    sm: {
      text: 'text-xl',
      image: { width: 60, height: 60 }
    },
    md: {
      text: 'text-2xl sm:text-3xl',
      image: { width: 80, height: 80 }
    },
    lg: {
      text: 'text-3xl sm:text-4xl',
      image: { width: 100, height: 100 }
    }
  };

  // Create the logo content
  const logoContent = (
    <div className={`flex items-center h-full ${imageOnly ? 'justify-center' : ''} ${className}`}>
      <div className="flex items-center">
        {/* Text logo */}
        {!imageOnly && (
          <span className={`font-bold text-accent ${sizeClasses[size].text} tracking-tighter leading-none`}>
            SarangResepi
          </span>
        )}
        {/* Image logo */}
        <div className={`relative flex items-center ${!imageOnly ? '-ml-2 sm:-ml-3' : ''}`}>
          <Image
            src="/images/nasilemak.png"
            alt="SarangResepi Logo"
            width={sizeClasses[size].image.width}
            height={sizeClasses[size].image.height}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );

  // If href is provided, wrap in Link component
  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  // Otherwise return just the logo content
  return logoContent;
}

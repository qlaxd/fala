import Image from 'next/image';
import React from 'react';

export function Logo() {
  return (
    <Image
      src="/images/logo/falafarmlogo.png"
      alt="Fala Farm Logo"
      width={150}
      height={60}
      style={{
        maxWidth: '150px',
        width: 'auto',
        height: 'auto'
      }}
      priority
    />
  );
}
import React from 'react';
import { SvgXml } from 'react-native-svg';

const LOGO_SVG = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="arcGrad" gradientUnits="userSpaceOnUse" x1="18" y1="102" x2="90" y2="15">
      <stop offset="0%"   stop-color="#F97316"/>
      <stop offset="50%"  stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
    <linearGradient id="sparkGrad" gradientUnits="userSpaceOnUse" x1="72" y1="52" x2="112" y2="4">
      <stop offset="0%"   stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
  </defs>

  <!-- 270° arc: from 3 o'clock (102,60) clockwise through 6→9→12 o'clock (60,18) -->
  <!-- Gap is at the upper-right quadrant where the sparkles live -->
  <path
    d="M 102 60 A 42 42 0 1 1 60 18"
    stroke="url(#arcGrad)"
    stroke-width="7"
    fill="none"
    stroke-linecap="round"
  />

  <!-- Large 4-point sparkle star at ~1 o'clock (top-right of arc gap) -->
  <path
    d="M 88 28 L 90.2 35.8 L 98 38 L 90.2 40.2 L 88 48 L 85.8 40.2 L 78 38 L 85.8 35.8 Z"
    fill="url(#sparkGrad)"
  />

  <!-- Small 4-point sparkle star (top-right, further out) -->
  <path
    d="M 105 10 L 106.2 14.8 L 111 16 L 106.2 17.2 L 105 22 L 103.8 17.2 L 99 16 L 103.8 14.8 Z"
    fill="url(#sparkGrad)"
  />
</svg>
`;

interface Props {
  size?: number;
}

export function AskLogo({ size = 120 }: Props) {
  return <SvgXml xml={LOGO_SVG(size)} width={size} height={size} />;
}

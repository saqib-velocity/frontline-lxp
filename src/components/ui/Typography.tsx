import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, fontSizes } from '@/constants/tokens';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
}

export function Heading1({ style, children, ...props }: TypographyProps) {
  return (
    <Text style={[styles.heading1, style]} {...props}>
      {children}
    </Text>
  );
}

export function Heading2({ style, children, ...props }: TypographyProps) {
  return (
    <Text style={[styles.heading2, style]} {...props}>
      {children}
    </Text>
  );
}

export function SectionTitle({ style, children, ...props }: TypographyProps) {
  return (
    <Text style={[styles.sectionTitle, style]} {...props}>
      {children}
    </Text>
  );
}

export function Body({ style, children, ...props }: TypographyProps) {
  return (
    <Text style={[styles.body, style]} {...props}>
      {children}
    </Text>
  );
}

export function Caption({ style, children, ...props }: TypographyProps) {
  return (
    <Text style={[styles.caption, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading1: {
    fontSize: fontSizes['3xl'],
    fontWeight: '800',
    color: colors.gray[900],
    lineHeight: fontSizes['3xl'] * 1.15,
  },
  heading2: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    lineHeight: fontSizes['2xl'] * 1.2,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.gray[900],
  },
  body: {
    fontSize: fontSizes.base,
    fontWeight: '400',
    color: colors.gray[700],
    lineHeight: fontSizes.base * 1.5,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: '400',
    color: colors.gray[500],
  },
});

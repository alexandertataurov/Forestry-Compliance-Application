import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light', icon: 'sun' },
        { value: 'dark', title: 'Dark', icon: 'moon' },
      ],
      dynamicTitle: true,
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  if (root) {
    root.classList.toggle('dark', isDark);
  }

  return (
    <ThemeProvider attribute="class" enableSystem={false} forcedTheme={isDark ? 'dark' : 'light'}>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <div className="p-4">
          <Story />
        </div>
      </div>
    </ThemeProvider>
  );
};

export const decorators = [withTheme];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

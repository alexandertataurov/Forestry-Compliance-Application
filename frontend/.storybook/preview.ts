import "../styles/globals.css";
import type { Preview } from "@storybook/react";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          enabled: true,
        },
        {
          id: 'button-name',
          enabled: true,
        },
        {
          id: 'input-label',
          enabled: true,
        },
      ],
    },
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px',
        },
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1200px',
          height: '800px',
        },
      },
      wide: {
        name: 'Wide Desktop',
        styles: {
          width: '1920px',
          height: '1080px',
        },
      },
    },
  },
  backgrounds: {
    default: 'surface',
    values: [
      {
        name: 'surface',
        value: 'var(--color-surface-bg)',
      },
      {
        name: 'surface-variant',
        value: 'var(--color-surface-bg-variant)',
      },
      {
        name: 'brand-primary',
        value: 'var(--color-brand-primary)',
      },
      {
        name: 'neutral-0',
        value: 'var(--color-neutral-0)',
      },
      {
        name: 'neutral-900',
        value: 'var(--color-neutral-900)',
      },
    ],
  },
  docs: {
    source: {
      state: 'open',
    },
  },
};

const preview: Preview = {
  parameters,
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;


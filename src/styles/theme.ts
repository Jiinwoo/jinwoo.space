const colors = {
  primary: {
    light: '#4a9eff',
    main: '#3182ce',
    dark: '#1778ff',
    hover: {
      light: '#3890ff',
      main: '#2776c2',
      dark: '#0e6af0',
    },
  },
  text: {
    primary: '#1a202c',
    secondary: '#4a5568',
    tertiary: '#718096',
    inverse: '#ffffff',
    hover: {
      primary: '#2d3748',
      secondary: '#2d3748',
      tertiary: '#4a5568',
      inverse: '#f7fafc',
    },
  },
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#e2e8f0',
    dark: '#29323c',
    hover: {
      primary: '#f7fafc',
      secondary: '#edf2f7',
      tertiary: '#cbd5e0',
      dark: '#1a202c',
    },
  },
  border: {
    light: '#e2e8f0',
    normal: '#cbd5e0',
    dark: '#718096',
    hover: {
      light: '#cbd5e0',
      normal: '#a0aec0',
      dark: '#4a5568',
    },
  },
  interactive: {
    focus: '#4a9eff',
    active: '#2776c2',
    disabled: '#a0aec0',
  },
}
const typography = {
  fontFamily: '나눔고딕, "NanumGothic", Nanum Gothic, sans-serif',
  heading: {
    h1: {
      fontSize: '2.5rem', // 40px
      lineHeight: 1.2,
      fontWeight: 800,
      mobile: {
        fontSize: '2rem', // 32px
      },
    },
    h2: {
      fontSize: '2rem', // 32px
      lineHeight: 1.3,
      fontWeight: 700,
      mobile: {
        fontSize: '1.5rem', // 24px
      },
    },
    h3: {
      fontSize: '1.5rem', // 24px
      lineHeight: 1.4,
      fontWeight: 600,
      mobile: {
        fontSize: '1.25rem', // 20px
      },
    },
  },
  body: {
    large: {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.6,
    },
    normal: {
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
    },
    small: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
    },
  },
}

const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
}

const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  large: '1440px',
}

const mediaQueries = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  large: `@media (min-width: ${breakpoints.large})`,
}

const borderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
  full: '9999px',
}

const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
}

const zIndices = {
  modal: 1000,
  overlay: 900,
  drawer: 800,
  dropdown: 700,
  header: 600,
  footer: 500,
}

type CustomTheme = {
  colors: typeof colors
  typography: typeof typography
  spacing: typeof spacing
  breakpoints: typeof breakpoints
  mediaQueries: typeof mediaQueries
  borderRadius: typeof borderRadius
  shadows: typeof shadows
  zIndices: typeof zIndices
}

export const theme: CustomTheme = {
  colors,
  typography,
  spacing,
  breakpoints,
  mediaQueries,
  borderRadius,
  shadows,
  zIndices,
}

// emotion의 Theme 타입 확장
declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}

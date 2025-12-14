import tailwindCssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [ `./index.html`, `./src/**/*.{js,ts,jsx,tsx}` ],
  darkMode: [ `class` ],
  plugins: [ tailwindCssAnimate ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      animation: {
        spinner: `spinner 1s linear infinite`,
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
      colors: {
        accent: {
          DEFAULT: `hsl(var(--accent))`,
          foreground: `hsl(var(--accent-foreground))`,
        },
        background: `hsl(var(--background))`,
        border: `hsl(var(--border))`,
        card: {
          DEFAULT: `hsl(var(--card))`,
          foreground: `hsl(var(--card-foreground))`,
        },
        chart: {
          1: `hsl(var(--chart-1))`,
          2: `hsl(var(--chart-2))`,
          3: `hsl(var(--chart-3))`,
          4: `hsl(var(--chart-4))`,
          5: `hsl(var(--chart-5))`,
        },
        destructive: {
          DEFAULT: `hsl(var(--destructive))`,
          foreground: `hsl(var(--destructive-foreground))`,
        },
        foreground: `hsl(var(--foreground))`,
        gold: {
          DEFAULT: `hsl(var(--gold))`,
          foreground: `hsl(var(--gold-foreground))`,
        },
        input: `hsl(var(--input))`,
        lightgold: {
          DEFAULT: `hsl(var(--light-gold))`,
          foreground: `hsl(var(--light-gold-foreground))`,
        },
        muted: {
          DEFAULT: `hsl(var(--muted))`,
          foreground: `hsl(var(--muted-foreground))`,
        },
        popover: {
          DEFAULT: `hsl(var(--popover))`,
          foreground: `hsl(var(--popover-foreground))`,
        },
        primary: {
          DEFAULT: `hsl(var(--primary))`,
          foreground: `hsl(var(--primary-foreground))`,
        },
        ring: `hsl(var(--ring))`,
        secondary: {
          DEFAULT: `hsl(var(--secondary))`,
          foreground: `hsl(var(--secondary-foreground))`,
        },
        success: {
          DEFAULT: `hsl(var(--success))`,
          foreground: `hsl(var(--success-foreground))`,
        },
        warning: {
          DEFAULT: `hsl(var(--warning))`,
          foreground: `hsl(var(--warning-foreground))`,
        },
      },
      keyframes: {
        spinner: {
          '0%': { opacity: `1` },
          '10%': { opacity: `0.7` },
          '100%': { opacity: `0` },
          '20%': { opacity: `0.3` },
          '35%': { opacity: `0.2` },
          '50%': { opacity: `0.1` },
          '75%': { opacity: `0.05` },
        },
      },
    },
  },
};

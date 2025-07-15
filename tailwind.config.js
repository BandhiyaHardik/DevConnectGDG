// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(59,130,246,0.18), 0 1.5px 8px rgba(0,0,0,0.18)',
        'card': '0 0 0 1px hsl(var(--border)), 0 8px 32px 0 rgba(59,130,246,0.13)',
        'feature': '0 0 0 1px hsl(var(--border)), 0 4px 24px 0 rgba(59,130,246,0.10)',
        'feature-hover': '0 8px 32px 0 rgba(59,130,246,0.18), 0 1.5px 8px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        '2xl': "2rem",
      },
      backdropBlur: {
        glass: '10px',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(145deg, #111827 40%, #1e293b 100%)',
        'demo-gradient': 'linear-gradient(135deg, #1e293b 60%, hsl(var(--primary)) 100%)',
      },
    },
  },
  plugins: [],
}
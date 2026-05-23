/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        lf: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#21262d',
          blue: '#58a6ff',
          green: '#3fb950',
          amber: '#d29922',
          red: '#f85149',
          purple: '#8b5cf6',
          muted: '#8b949e',
          faint: '#484f58',
        },
      },
    },
  },
  plugins: [],
};

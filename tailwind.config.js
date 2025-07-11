/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00D4FF',
        'neon-purple': '#8B5CF6',
        'neon-green': '#00FF88',
        'neon-pink': '#FF00FF',
        'dark-bg': '#0A0A0F',
        'dark-card': '#1A1A2E',
        'dark-hover': '#16213E',
      },
      fontFamily: {
        'gaming': ['Orbitron', 'Exo', 'sans-serif'],
        'tech': ['Audiowide', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px theme(colors.neon-blue), 0 0 10px theme(colors.neon-blue), 0 0 15px theme(colors.neon-blue)' 
          },
          '100%': { 
            boxShadow: '0 0 10px theme(colors.neon-blue), 0 0 20px theme(colors.neon-blue), 0 0 30px theme(colors.neon-blue)' 
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00D4FF 0%, #8B5CF6 50%, #00FF88 100%)',
      }
    },
  },
  plugins: [],
};
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          DEFAULT: '#121212',
          surface: '#1E1E1E',
          surface2: '#232323',
          border: 'rgba(255,255,255,0.1)',
        },
        // Accent colors - Warm, cheese-inspired palette
        // Main accent: Rich golden amber (#FBC02D) adjusted for better contrast
        // Hover: Slightly darker and more saturated for clear interaction
        // Light: Softer tone for secondary elements
        accent: {
          DEFAULT: '#FBC02D', // Rich golden amber
          hover: '#F9A825',   // Deeper golden tone for hover states
          light: '#FFE082',   // Soft golden tone for secondary elements
        },
        // Status colors
        status: {
          success: '#4CAF50',
          error: '#F44336',
          warning: '#FFA726',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          disabled: '#666666',
        },
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config;

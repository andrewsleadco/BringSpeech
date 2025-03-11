/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          // You can customize your color palette here
          // For example:
          // primary: {
          //   light: '#85d7ff',
          //   DEFAULT: '#1fb6ff',
          //   dark: '#009eeb',
          // },
        },
        fontFamily: {
          // You can customize your fonts here
          // For example:
          // sans: ['Inter', 'sans-serif'],
          // serif: ['Merriweather', 'serif'],
        },
        spacing: {
          // Add custom spacing values if needed
        },
        borderRadius: {
          // Add custom border radius values if needed
        },
        boxShadow: {
          // Add custom shadow values if needed
        },
      },
    },
    plugins: [],
  }
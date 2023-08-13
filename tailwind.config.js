/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],  theme: {
    screens: {
      mobile: '250px',
      tablet: '768px',
      web: '1024px',
      lgweb: '1200px'
    },
    extend:{
      fontFamily:{
        sans: ['var(--font-nunito)']
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide') //hides scroll bar in the pictureSlide component
  ],
  // plugins: [require("@tailwindcss/forms")],
}

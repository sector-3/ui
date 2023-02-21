/** @type {import('tailwindcss').Config} */

const progressBarSafelist = []
for (let percentage = 0; percentage <= 100; percentage++) {
  progressBarSafelist.push(`w-[${percentage}%]`)
}
console.log('progressBarSafelist:', progressBarSafelist)

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: progressBarSafelist,
  theme: {
    extend: {},
  },
  plugins: [],
}

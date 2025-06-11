// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // هذا القسم يخبر Tailwind أين يبحث عن كلاسات Tailwind في مشروعك
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // للـ App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // للـ Pages Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // لمكوناتك في مجلد components
    "./src/**/*.{js,ts,jsx,tsx,mdx,css}", // لضمان فحص مجلد src بأكمله
    "./src/styles/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

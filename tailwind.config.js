/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Add the type colors with background, transparency, hover, and border variants
    'bg-emerald-500', 'hover:bg-emerald-500/20', 'hover:!border-emerald-500',
    'bg-red-700', 'hover:bg-red-700/20', 'hover:!border-red-700',
    'bg-blue-500', 'hover:bg-blue-500/20', 'hover:!border-blue-500',
    'bg-yellow-400', 'hover:bg-yellow-400/20', 'hover:!border-yellow-400',
    'bg-green-700', 'hover:bg-green-700/20', 'hover:!border-green-700',
    'bg-fuchsia-800', 'hover:bg-fuchsia-800/20', 'hover:!border-fuchsia-800',
    'bg-gray-400', 'hover:bg-gray-400/20', 'hover:!border-gray-400',
    'bg-cyan-300', 'hover:bg-cyan-300/20', 'hover:!border-cyan-300',
    'bg-yellow-900', 'hover:bg-yellow-900/20', 'hover:!border-yellow-900',
    'bg-indigo-400', 'hover:bg-indigo-400/20', 'hover:!border-indigo-400',
    'bg-pink-500', 'hover:bg-pink-500/20', 'hover:!border-pink-500',
    'bg-yellow-600', 'hover:bg-yellow-600/20', 'hover:!border-yellow-600',
    'bg-indigo-700', 'hover:bg-indigo-700/20', 'hover:!border-indigo-700',
    'bg-indigo-900', 'hover:bg-indigo-900/20', 'hover:!border-indigo-900',
    'bg-gray-800', 'hover:bg-gray-800/20', 'hover:!border-gray-800',
    'bg-gray-600', 'hover:bg-gray-600/20', 'hover:!border-gray-600',
    'bg-pink-300', 'hover:bg-pink-300/20', 'hover:!border-pink-300',
    'bg-gray-500', 'hover:bg-gray-500/20', 'hover:!border-gray-500',
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        magnolia: "#faf8ff",
        cinder: "#11131b",
        "athens-gray": "#e1e1ed",
        "gray-suit": "#c8c4d6",
        "gun-powder": "#464555",
        ebony: "#131b2e",
        shark: "#191b23",
        melrose: "#c5c0ff",
        shark2: "#1d1f28",
        "persian-blue": "#3525cd",
        "royal-blue": "#584de8",
        shark3: "#282a32",
        "hawkes-blue": "#dae2fd",
        "titan-white": "#e2e7ff",
      },
    },
  },
  plugins: [],
};

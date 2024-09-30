import { keepTheme } from "keep-react/keepTheme";

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default keepTheme(tailwindConfig);
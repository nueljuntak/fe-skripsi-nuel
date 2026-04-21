/** @type {import('tailwindcss').Config} */
export default {
    // Pakai 'selector' agar tombol toggle kita berfungsi (pengganti 'class' di v4)
    darkMode: 'selector', 
    
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                ukrim: {
                    dark: '#030712',    // Background Gelap
                    card: '#111827',    // Background Kartu
                    primary: '#2563EB', // Biru Aksen
                    muted: '#94A3B8',   // Teks Abu-abu
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
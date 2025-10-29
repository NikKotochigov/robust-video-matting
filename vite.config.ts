import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
        cors: true,
    },
    build: {
        target: 'esnext',
        minify: 'terser',
        sourcemap: false,
        outDir: 'dist',
        assetsDir: 'assets',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import path from 'path';
export default defineConfig({
    plugins: [
        react(),
        babel({
            babelConfig: {
                plugins: [['babel-plugin-react-compiler', {
                            development: 'all' 
                        }]],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@features': path.resolve(__dirname, './src/features'),
            '@shared': path.resolve(__dirname, './src/features/shared'),
            '@auth': path.resolve(__dirname, './src/features/auth'),
            '@diary': path.resolve(__dirname, './src/features/diary'),
            '@dashboard': path.resolve(__dirname, './src/features/dashboard'),
            '@onboarding': path.resolve(__dirname, './src/features/onboarding'),
            '@profile': path.resolve(__dirname, './src/features/profile'),
            '@reports': path.resolve(__dirname, './src/features/reports'),
            '@components': path.resolve(__dirname, './src/features/shared/components'),
            '@layout': path.resolve(__dirname, './src/features/shared/components/layout'),
            '@ui': path.resolve(__dirname, './src/features/shared/components/ui'),
            '@hooks': path.resolve(__dirname, './src/features/shared/hooks'),
            '@services': path.resolve(__dirname, './src/features/shared/services'),
            '@store': path.resolve(__dirname, './src/features/shared/store'),
            '@typing': path.resolve(__dirname, './src/features/shared/types'),
            '@utils': path.resolve(__dirname, './src/features/shared/utils'),
            '@styles': path.resolve(__dirname, './src/features/shared/styles'),
            '@locales': path.resolve(__dirname, './src/features/shared/locales'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});

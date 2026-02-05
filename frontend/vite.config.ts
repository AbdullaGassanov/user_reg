import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		host: true,
		port: 80,
		proxy: {
			'/api': {
				target: 'http://backend:4000',
				changeOrigin: true,
				secure: false,
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				loadPaths: [path.resolve(__dirname, 'src')],
				additionalData: `@use "styles/variables" as *;`,
			},
		},
	},
});

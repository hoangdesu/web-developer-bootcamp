import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

    return defineConfig({
        plugins: [react()],
        server: {
            proxy: {
                '/api/v1': {
                    target: process.env.TARGET_PROXY_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
            watch: {
                usePolling: true,
            },
            host: true, // needed for the Docker Container port mapping to work
            port: parseInt(process.env.PORT),
            // port: parseInt(process.env.PORT)
        },
        // base: '/web-developer-bootcamp/'
    });
};

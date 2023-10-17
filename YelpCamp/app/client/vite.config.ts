import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

    return defineConfig({
        // plugins: [react(), mkcert()],
        plugins: [react()],
        server: {
            proxy: {
                '/api/v1': {
                    target: process.env.TARGET_PROXY_URL,
                    changeOrigin: true,
                    // secure: true,
                },
            },
            watch: {
                usePolling: true,
            },
            host: true,
            port: parseInt(process.env.PORT),
            // https: true,
        },
        // base: '/web-developer-bootcamp/' // only used for production, will fukup dev server
    });
};

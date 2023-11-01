import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

    return defineConfig({
        // plugins: [react(), mkcert()],
        plugins: [react()],
        server: {
            host: true,
            port: parseInt(process.env.PORT),
            https: false,
            open: true,
            watch: {
                usePolling: true,
            },

            // remove proxy server for production build
            // proxy: {
            //     '/api/v1': {
            //         target: process.env.VITE_BASE_URL,
            //         changeOrigin: true,
            //         secure: true,
            //     },
            // },
        },
        // base: '/web-developer-bootcamp/' // only used for production, will fukup dev server
    });
};

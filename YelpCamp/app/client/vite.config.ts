import { build, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

    const { format } = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return defineConfig({
        // plugins: [react(), mkcert()],
        plugins: [react()],
        server: {
            host: true,
            port: parseInt(process.env.PORT),
            https: false,
            open: !process.env.DOCKER ? true : false,
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
        define: {
            __BUILD_TIMESTAMP__: JSON.stringify(format(new Date())),
        },
        // base: '/web-developer-bootcamp/' // only used for production, will fukup dev server
    });
};

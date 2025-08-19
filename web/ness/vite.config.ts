import path from 'path';

import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    base: '/ness/',
    plugins: [
        reactRouter(),
        tsconfigPaths(),
        svgr(),
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: path.join(import.meta.dirname, 'node_modules', 'mediainfo.js', 'dist', 'MediaInfoModule.wasm'),
                    dest: '',
                },
            ],
        }),
    ],
    server: {
        port: 3002,
        fs: {
            allow: [searchForWorkspaceRoot(process.cwd()), '../../dist/MediaInfoModule.wasm'],
        },
    },
});

import path from 'path';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteTsConfigPaths(),
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
        fs: {
            allow: [searchForWorkspaceRoot(process.cwd()), '../../dist/MediaInfoModule.wasm'],
        },
    },
});

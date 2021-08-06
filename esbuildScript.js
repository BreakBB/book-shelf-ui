require('esbuild').build({
    entryPoints: ['./src/index.tsx'],
    platform: 'browser',
    bundle: true,
    sourcemap: true,
    minify: true,
    target: "es2020",
    loader: {
        '.jpg': "file"
    },
    outdir: 'public/build',
}).catch(() => process.exit(1))
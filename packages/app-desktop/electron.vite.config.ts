import { resolve } from "path"
import { bytecodePlugin, defineConfig, externalizeDepsPlugin, type ElectronViteConfig } from "electron-vite"
import react from "@vitejs/plugin-react"

const protectedStrings: string[] =
[

]

const CONFIG: ElectronViteConfig = 
{
    main: 
    {
        plugins: 
        [
            externalizeDepsPlugin(),
            bytecodePlugin({ protectedStrings })
        ],

        build: { lib: { entry: "sources/main" }}
    },
    preload: 
    {
        plugins: 
        [
            externalizeDepsPlugin()
        ],

        build: { lib: { entry: "sources/preload" }}
    },
    renderer: 
    {
        resolve: 
        {
            alias: 
            { 
                "source": resolve("sources/renderer/source"),
                "sources": resolve("sources"),
                "modules": resolve("sources/renderer"),
            }
        },
        
        plugins: 
        [
            react(),
            // bytecodePlugin({ protectedStrings }) // Fuck, this plugin is currently not supported in renderer process
        ],

        root: "sources/renderer",
        publicDir: resolve("sources/renderer/public"),
        build:
        { rollupOptions: { input: "sources/renderer/index.html" }}
    },
}

export default defineConfig(CONFIG);

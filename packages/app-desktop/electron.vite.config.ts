import path, { resolve } from "path"
import { bytecodePlugin, defineConfig, externalizeDepsPlugin, type ElectronViteConfig } from "electron-vite"
import react from "@vitejs/plugin-react"

const protectedStrings: string[] =
[

]

/** If you change this, you must also change the 'main' field in the package.json */
const outDir = resolve("./.application");

const CONFIG: ElectronViteConfig = 
{
    
    main: 
    {
        plugins: 
        [
            externalizeDepsPlugin(),
            bytecodePlugin({ protectedStrings })
        ],

        build:
        { 
            lib: { entry: "sources/main" },
            outDir: path.join(outDir, "main")
        }
    },
    preload: 
    {
        plugins: 
        [
            externalizeDepsPlugin()
        ],

        build: 
        { 
            lib: { entry: "sources/preload" },
            outDir: path.join(outDir, "preload")
        }
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
            externalizeDepsPlugin(),
            react(),
            // bytecodePlugin({ protectedStrings }) // Fck, this plugin is currently not supported in renderer process
        ],

        root: "sources/renderer",
        publicDir: resolve("sources/renderer/public"),
        build:
        { 
            rollupOptions: { input: "sources/renderer/index.html" },
            outDir: path.join(outDir, "renderer")
        }
    },
}

export default defineConfig(CONFIG);

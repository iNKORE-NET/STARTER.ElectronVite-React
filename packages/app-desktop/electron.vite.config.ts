import path from "path";
import fs from "fs";

import { bytecodePlugin, defineConfig, externalizeDepsPlugin, type ElectronViteConfig } from "electron-vite";
import react from "@vitejs/plugin-react";

const protectedStrings: string[] =
[

]

/** If you change this, you must also change the 'main' field in the package.json */
const outDir = path.resolve("./.application");

const allWindows = (() => 
{
    const pageEntry: any = {};
    const winsRoot = path.resolve("./sources/renderer/entries");
    // glob.sync(path.join(winsRoot, '**/index.html')).forEach((entry) => 
    // {
    //     const pathArr = entry.split('/');
    //     const name = pathArr[pathArr.length - 2];
    //     pageEntry[name] = path.join(winsRoot, name, "index.html");
    // });

    fs.readdirSync(winsRoot).forEach((name) =>
    {
        const indexHTML = path.join(winsRoot, name, "index.html");
        if (!fs.existsSync(indexHTML)) return;
        pageEntry[name] = indexHTML;
    });
    
    return pageEntry;
})();

const COMMON_ALIASES =
{
    "common": path.resolve("sources/common"),
    "sources": path.resolve("sources"),
}



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
        },

        resolve:
        {
            alias: { ...COMMON_ALIASES, "source": path.resolve("sources/main") }
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
            alias: { ...COMMON_ALIASES, "source": path.resolve("sources/renderer/source") }
        },
        
        plugins: 
        [
            externalizeDepsPlugin(),
            react(),
            // bytecodePlugin({ protectedStrings }) // Fck, this plugin is currently not supported in renderer process
        ],

        root: "sources/renderer",
        publicDir: path.resolve("sources/renderer/public"),
        build:
        { 
            rollupOptions: 
            { 
                input: allWindows,
            },
            outDir: path.join(outDir, "renderer"),
        }
    },
}

export default defineConfig(CONFIG);

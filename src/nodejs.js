import * as fs from "fs/promises";
import * as path from "path";
import { QWCompiler } from "./main.js";
import { CompileResult } from "./context/CompileResult.js";
import { CompilerError } from "./error/CompilerError.js";

(async () =>
{
    let srcPath = "";
    let outputPath = "";

    let argv = process.argv.slice(2);

    srcPath = argv[0];
    outputPath = argv[1];

    let context = new QWCompiler();
    context.setOnGetModule(async (info) =>
    {
        let srcCode = await fs.readFile(path.join(path.basename(srcPath, info.path)), { encoding: "utf-8" });
        return srcCode;
    });

    let srcString = await fs.readFile(srcPath, { encoding: "utf-8" });


    try
    {
        let result = await context.compile(srcString);

        console.log(`Writing to ${outputPath}`);
        await fs.writeFile(outputPath, result.bin);

        console.log("done.");
    }
    catch (err)
    {
        if (err instanceof CompilerError)
        {
            console.error("compile error:");
            console.error(err.message);
            console.error(`at ${err.moduleName} (index: ${err.index})`);
        }
        else
        {
            console.error("error:", err);
        }
    }
})();
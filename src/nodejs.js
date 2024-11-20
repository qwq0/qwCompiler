import * as fs from "fs/promises";
import { QWCompiler } from "./main";

(async () =>
{
    let srcPath = "";
    let outputPath = "";

    let argv = process.argv.slice(2);

    srcPath = argv[0];
    outputPath = argv[1];

    let context = new QWCompiler();
    context.setOnGetModule(async () =>
    {

    });
})();
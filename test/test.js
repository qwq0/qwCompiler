(async () =>
{
    let wasmBin = new Uint8Array(await (await fetch("./test.wasm")).arrayBuffer());
    let wasmModule = await WebAssembly.compile(wasmBin);
    let wasmInstance = await WebAssembly.instantiate(wasmModule, {
        env: {
            console_log_number: (/** @type {number} */ num) =>
            {
                console.log(num);
            }
        }
    });
})();
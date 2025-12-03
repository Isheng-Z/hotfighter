
// DEPRECATED
// Please use main.cjs instead.
// 由于 package.json 中设置了 "type": "module"，.js 文件会被当作 ES Module 处理。
// 而 Electron 主进程通常使用 CommonJS (require)，因此必须将文件后缀改为 .cjs 才能正常运行。
// 请参考 README.md 修改 package.json 的 main 字段为 "main.cjs"。

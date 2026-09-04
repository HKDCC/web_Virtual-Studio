# Scripts

脚本文件名统一使用小写 kebab-case；扩展名按模块格式区分：`.mjs` 为 ESM，`.cjs` 仅用于 CommonJS，`.py` 为 Python。

- `arena/`：Arena 数据抓取工具。
- `notion/`：Notion 维护工具。
- `legacy/`：保留但不作为默认入口的旧实现。
- `maintenance/`：需要输入文件或人工触发的一次性维护工具。

正式入口通过 `package.json` 中的 npm scripts 暴露。未列入 npm scripts 的脚本不得假定会在部署或构建阶段自动运行。

`legacy/update-arena-data.py` 保留作历史参考；Arena 同步正式入口是 `npm run sync:arena`。

`maintenance/parse-arena.mjs` 用法：

```bash
node scripts/maintenance/parse-arena.mjs <arena-html-path>
```

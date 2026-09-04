# Reference 素材目录

本目录保存 Virtual Studio 的原始资料、历史快照和离线素材，不是网站运行时的发布目录。

## 目录约定

- `demos/`：网站 Demo、预览页和带日期的历史快照。
- `articles/`：文章 HTML 导出或离线归档；发布版本仍位于 `virtual-studio/public/articles/`。
- `game-library/`：游戏数据表及其封面附件。
- `music/`：音乐源文件；网站实际播放版本位于 `virtual-studio/public/music/`。

## 命名规则

- 目录和工具文件使用小写 kebab-case，例如 `game-library`、`site-preview-2026-03-17.html`。
- 需要参与脚本、URL 或发布流程的派生文件使用小写 kebab-case 和 ASCII 字符。
- 原始中文标题可以保留，避免因翻译或过度 slug 化丢失来源信息。
- 日期使用 ISO 格式 `YYYY-MM-DD`。
- 不使用 `copy`、`final-final`、`new`、`tmp` 等临时后缀。

## 来源与保留说明

`game-library/game-list.xlsx` 由 `virtual-studio/scripts/build-games.py` 读取；修改其路径时必须同步修改脚本。

`articles/` 中的文章可能与发布目录存在内容相同的副本。删除前应确认它不承担离线归档或来源留存职责。

未被源码直接引用的素材默认保留，只有在确认没有外链、人工流程或可靠访问日志后才考虑删除。

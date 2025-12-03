# LeetCode Flash - Hot 100 算法记忆卡片

这是一款基于 React 的 LeetCode Hot 100 算法记忆卡片应用。
**特性**：
- **完全离线**：数据内置，无需联网，无 API Key 依赖。
- **随机练习**：支持随机抽取 10/20/50/100 道题目进行无压测试。
- **双语支持**：一键切换中文/英文题目与解析。
- **莫奈配色**：日间模式（撑阳伞的女人）与夜间模式（日出·印象）。

---

## 如何在本地运行 (就像 EXE 软件一样)

由于这是一个纯静态的网页应用，你可以非常容易地在本地运行它。

### 方法一：直接下载 (最简单)
如果你不懂编程，只想用：
1. 下载本项目所有代码。
2. 确保你的电脑安装了 `Node.js`。
3. 在项目文件夹运行以下命令打包：
   ```bash
   npm install
   npm run build
   ```
4. 打包完成后，你会得到一个 `dist` 文件夹。
5. 这个 `dist` 文件夹里的内容就是你的“软件”。你可以用浏览器打开 `index.html` (推荐使用 `http-server` 或 VSCode 的 Live Server 插件预览，直接双击 HTML 可能因浏览器安全策略导致部分图标加载失败)。

### 方法二：开发模式
1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动服务：
   ```bash
   npm run dev
   ```
3. 浏览器访问 `http://localhost:5173`。

---

## 数据来源
所有题目数据存储在 `src/constants.ts` 中，包含 LeetCode Hot 100 的核心思路、时空复杂度及示例代码。

## 技术栈
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (图标)

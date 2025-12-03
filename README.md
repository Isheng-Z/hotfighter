
# LeetCode Flash - Hot 100 算法记忆卡片

这是一款基于 React 的 LeetCode Hot 100 算法记忆卡片应用。
**特性**：
- **完全离线**：数据内置，无需联网，无 API Key 依赖。
- **随机练习**：支持随机抽取 10/20/50/100 道题目进行无压测试。
- **双语支持**：一键切换中文/英文题目与解析。
- **莫奈配色**：日间模式（撑阳伞的女人）与夜间模式（日出·印象）。

---

## 一、在本地作为网页运行

1. **安装依赖**：
   确保安装 Node.js，然后在终端运行：
   ```bash
   npm install
   ```

2. **启动开发服务器**：
   ```bash
   npm run dev
   ```
   浏览器访问 `http://localhost:5173`。

3. **构建静态文件**：
   ```bash
   npm run build
   ```
   构建后的文件在 `dist` 目录，可以直接用浏览器打开 `index.html` 使用（部分浏览器可能限制本地文件访问，建议配合 Live Server）。

---

## 二、打包为电脑软件 (.exe)

本项目已包含 `main.js` 配置文件，支持通过 **Electron** 打包为桌面应用。

1. **安装 Electron 相关依赖**：
   ```bash
   npm install --save-dev electron electron-builder
   ```

2. **修改 `package.json`**：
   请手动修改你的 `package.json` 文件，添加以下内容：
   ```json
   {
     "main": "main.js",
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "electron:dev": "electron .",
       "electron:build": "vite build && electron-builder"
     }
   }
   ```

3. **运行与打包**：
   *   **测试运行**：`npm run electron:dev`
   *   **打包 EXE**：`npm run electron:build`
       打包完成后，检查项目下的 `dist` 文件夹，你会发现安装包。

---

## 三、打包为手机 App (Android/iOS)

使用 **Capacitor** 将应用打包为原生 App。

1. **安装 Capacitor**：
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init
   ```
   *(Web asset directory 请填入 `dist`)*

2. **构建 Web 资源**：
   ```bash
   npm run build
   ```

3. **添加 Android 平台**：
   ```bash
   npx cap add android
   npx cap sync
   ```

4. **生成 APK**：
   *   你需要安装 **Android Studio**。
   *   打开 Android Studio，选择项目里的 `android` 文件夹打开。
   *   点击菜单栏 `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`。
   *   生成的 APK 即可安装到手机。

---

## 数据来源
所有题目数据存储在 `src/constants.ts` 中，包含 LeetCode Hot 100 的核心思路、时空复杂度及示例代码。

## 技术栈
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (图标)
- Electron (桌面端支持)
- Capacitor (移动端支持)

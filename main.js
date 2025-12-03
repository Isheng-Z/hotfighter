
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 处理 Windows 安装过程中的快捷方式创建事件
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'LeetCode Flash',
    icon: path.join(__dirname, 'public/favicon.ico'), // 如果你有图标的话
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true, // 隐藏菜单栏，更像原生 App
  });

  // 生产环境：加载打包后的 index.html
  // 开发环境：你可以修改这里加载 http://localhost:5173
  // 这里默认配置为加载构建后的文件，适合打包 EXE
  
  // 检查是否是开发环境 (可以通过环境变量设置)
  const isDev = !app.isPackaged;

  if (isDev) {
    // 开发模式加载 Vite 服务地址
    mainWindow.loadURL('http://localhost:5173');
    // 打开开发者工具
    // mainWindow.webContents.openDevTools();
  } else {
    // 生产模式加载本地文件
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

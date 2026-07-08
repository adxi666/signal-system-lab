const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  mainWindow.loadFile(path.join(__dirname, '../out/index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function startBackend() {
  const backendPath = path.join(__dirname, '../../backend');
  const backendExe = path.join(backendPath, 'backend.exe');

  if (require('fs').existsSync(backendExe)) {
    backendProcess = spawn(backendExe, {
      cwd: backendPath,
      detached: false
    });
  } else {
    console.log('Backend executable not found, running without backend');
  }
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
  }
}

app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', function () {
  stopBackend();
});

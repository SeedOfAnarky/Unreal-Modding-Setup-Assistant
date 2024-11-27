const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const extract = require('extract-zip');
const { exec } = require('child_process');
const vi = require('win-version-info'); // Changed import

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('public/index.html');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Enhanced version info handler
ipcMain.handle('get-exe-version', async (event, exePath) => {
  try {
    if (!exePath) {
      throw new Error('No executable path provided');
    }

    // Verify file exists
    await fs.promises.access(exePath);

    // Use win-version-info to get version
    const versionInfo = vi(exePath);
    
    // Prioritize FileVersion, fallback to other possible version fields
    return versionInfo.FileVersion 
      || versionInfo.fileVersion 
      || versionInfo.ProductVersion 
      || 'Unknown version';
  } catch (error) {
    console.error(`Version check error for ${exePath}:`, error);
    
    // Send error to renderer if possible
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('error', {
        message: 'Failed to retrieve executable version',
        details: error.toString(),
        path: exePath
      });
    }
    
    throw error;
  }
});

// Existing handlers (kept unchanged)
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('read-directory', async (event, directoryPath) => {
  try {
    const files = await fs.promises.readdir(directoryPath);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
});

ipcMain.handle('download-file', async (event, { url, fileName }) => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const totalLength = parseInt(response.headers['content-length'], 10);
    let downloadedLength = 0;

    const downloadPath = path.join(app.getPath('downloads'), fileName);
    const writer = fs.createWriteStream(downloadPath);

    response.data.on('data', (chunk) => {
      downloadedLength += chunk.length;
      const progress = (downloadedLength / totalLength) * 100;
      mainWindow.webContents.send('download-progress', progress);
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(downloadPath));
      writer.on('error', (error) => {
        fs.unlink(downloadPath, () => {});
        reject(error);
      });
    });
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
});

ipcMain.handle('extract-zip', async (event, { zipPath, destPath }) => {
  try {
    await extract(zipPath, { dir: destPath });
    try {
      await fs.promises.unlink(zipPath);
    } catch (cleanupError) {
      console.error('Error cleaning up zip file:', cleanupError);
    }
    return true;
  } catch (error) {
    console.error('Extraction error:', error);
    throw error;
  }
});

ipcMain.handle('launch-exe', async (event, { directory, exe }) => {
  return new Promise((resolve, reject) => {
    const exePath = path.join(directory, exe);
    exec(`"${exePath}"`, { cwd: directory }, (error) => {
      if (error) {
        console.error('Error launching exe:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle('check-file-exists', async (event, filePath) => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
});

ipcMain.handle('create-directory', async (event, dirPath) => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
});

ipcMain.handle('log-error', async (event, { error, context }) => {
  try {
    const logPath = path.join(app.getPath('userData'), 'error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${context}: ${error}\n`;
    await fs.promises.appendFile(logPath, logEntry);
    return true;
  } catch (error) {
    console.error('Error writing to log:', error);
    throw error;
  }
});
// Import required Electron and Node.js modules
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const extract = require('extract-zip');
const { exec } = require('child_process');
const vi = require('win-version-info');
const { globalShortcut } = require('electron');

// Global variables to store game-related information
let mainWindow;
let gameDirectory = null;
let gameInfo = null;
global.selectedGameDirectory = null;
global.selectedGameInfo = null;

/**
 * Create the main application window
 * Configures the main Electron browser window with specific settings
 */
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

  // Load the main HTML file
  mainWindow.loadFile('public/index.html');
  
  // Open DevTools for debugging (can be removed in production)
  mainWindow.webContents.openDevTools();
}

// IPC Handlers for various file system and application operations

/**
 * Retrieve version and description information for an executable file
 * Uses win-version-info to extract metadata about the executable
 */
ipcMain.handle('get-exe-version', async (event, exePath) => {
  try {
    if (!exePath) {
      throw new Error('No executable path provided');
    }

    // Verify file exists
    await fs.promises.access(exePath);
    const versionInfo = vi(exePath);
    
    // Return comprehensive version information
    return {
      version: versionInfo.FileVersion || versionInfo.fileVersion || versionInfo.ProductVersion || 'Unknown version',
      description: versionInfo.FileDescription || versionInfo.fileDescription || path.basename(exePath, '.exe'),
      productName: versionInfo.ProductName || versionInfo.productName,
    };
  } catch (error) {
    console.error(`Version check error for ${exePath}:`, error);
    
    // Send error to renderer process if possible
    if (mainWindow?.webContents) {
      mainWindow.webContents.send('error', {
        message: 'Failed to retrieve executable info',
        details: error.toString(),
        path: exePath
      });
    }
    throw error;
  }
});

/**
 * Open a directory selection dialog
 * Allows user to choose a game directory or executable
 */
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: [
      'openDirectory',
      'openFile', 
      'showHiddenFiles',
      'dontAddToRecent',
      'createDirectory'
    ],
    filters: [
      { name: 'Executables', extensions: ['exe'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    title: 'Select Game Directory or Executable',
    buttonLabel: 'Select',
    defaultPath: app.getPath('desktop')
  });
  return result.filePaths[0];
});

/**
 * Read contents of a specified directory
 * @param {string} directoryPath - Path to the directory to read
 */
ipcMain.handle('read-directory', async (event, directoryPath) => {
  try {
    const files = await fs.promises.readdir(directoryPath);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
});

/**
 * Download a file from a given URL
 * Provides download progress updates to the renderer process
 */
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

    // Send download progress updates
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

/**
 * Extract a ZIP file to a specified destination
 * Optionally removes the ZIP file after extraction
 */
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

/**
 * Launch an executable from a specified directory
 */
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

/**
 * Check if a file exists at the given path
 */
ipcMain.handle('check-file-exists', async (event, filePath) => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
});

/**
 * Delete a file from the file system
 */
ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
});

/**
 * Create a directory (with recursive option)
 */
ipcMain.handle('create-directory', async (event, dirPath) => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
});

/**
 * Log errors to a file in the user's data directory
 */
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

/**
 * Download UAssetGUI tool
 */
ipcMain.handle('download-uassetgui', async (event, gameDirectory) => {
  const url = 'https://github.com/atenfyr/UAssetGUI/releases/download/v1.0.2/UAssetGUI.exe';
  const fileName = 'UAssetGUI.exe';
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const downloadPath = path.join(gameDirectory, fileName);
    const writer = fs.createWriteStream(downloadPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(downloadPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('UAssetGUI download error:', error);
    throw error;
  }
});

/**
 * Watch for USMAP file generation and handle renaming
 * @param {string} directory - Directory to watch
 * @param {object} info - Game version information
 */
function watchForUSMAP(directory, info) {
  if (!directory) return;
  
  const watcher = fs.watch(directory, (eventType, filename) => {
    if (filename === 'Mappings.usmap') {
      const oldPath = path.join(directory, filename);
      const newName = `${info.version.description}-${info.version.version}-Mappings.usmap`;
      const newPath = path.join(directory, newName);
      
      fs.rename(oldPath, newPath, (err) => {
        if (!err) {
          // Send event to indicate USMAP generation
          mainWindow.webContents.send('usmap-generated', true);
        } else {
          console.error('Error renaming USMAP file:', err);
        }
      });
      watcher.close();
    }
  });
}

/**
 * Store game information for later use
 */
ipcMain.handle('store-game-info', async (event, info) => {
  gameDirectory = info.directory;
  gameInfo = info;
  watchForUSMAP(gameDirectory, gameInfo);
  return true;
});

// Application lifecycle event handlers

// When the app is ready, create the main window and set up global shortcuts
app.whenReady().then(() => {
  createWindow();

  // Global shortcut to trigger USMAP watching
  globalShortcut.register('CommandOrControl+Num6', () => {
    console.log('Ctrl+Numpad6 pressed');
    if (gameDirectory && gameInfo) {
      watchForUSMAP(gameDirectory, gameInfo);
    } else {
      console.warn('Game directory or game info not set');
    }
  });

  // Clean up global shortcuts when all windows are closed
  app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

// Activate event for macOS specific behavior
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In main.js IPC handlers section
ipcMain.handle('open-directory', async (event, directoryPath) => {
  try {
    // Use platform-specific command to open directory
    const { shell } = require('electron');
    shell.openPath(directoryPath);
    return true;
  } catch (error) {
    console.error('Error opening directory:', error);
    throw error;
  }
});
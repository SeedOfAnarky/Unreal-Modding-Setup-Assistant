const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is running');

contextBridge.exposeInMainWorld('electron', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readDirectory: (path) => ipcRenderer.invoke('read-directory', path),
  downloadFile: (url, fileName) => ipcRenderer.invoke('download-file', { url, fileName }),
  extractZip: (zipPath, destPath) => ipcRenderer.invoke('extract-zip', { zipPath, destPath }),
  launchExe: (directory, exe) => ipcRenderer.invoke('launch-exe', { directory, exe }),
  getExeVersion: (exePath) => ipcRenderer.invoke('get-exe-version', exePath),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, progress) => callback(progress))
});
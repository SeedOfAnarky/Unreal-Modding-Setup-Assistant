const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is running');

contextBridge.exposeInMainWorld('electron', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readDirectory: (path) => ipcRenderer.invoke('read-directory', path),
  downloadFile: (url, fileName) => ipcRenderer.invoke('download-file', { url, fileName }),
  extractZip: (zipPath, destPath) => ipcRenderer.invoke('extract-zip', { zipPath, destPath }),
  launchExe: (directory, exe) => ipcRenderer.invoke('launch-exe', { directory, exe }),
  getExeVersion: (exePath) => ipcRenderer.invoke('get-exe-version', exePath),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, progress) => callback(progress)),
  storeGameInfo: (info) => ipcRenderer.invoke('store-game-info', info),
  startUsmapMonitoring: (directory, gameInfo) => ipcRenderer.invoke('start-usmap-monitoring', directory, gameInfo),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  
  // New methods for UAssetGUI download and directory opening
  downloadUAssetGUI: (gameDirectory) => ipcRenderer.invoke('download-uassetgui', gameDirectory),
  openDirectory: (directoryPath) => ipcRenderer.invoke('open-directory', directoryPath)
});
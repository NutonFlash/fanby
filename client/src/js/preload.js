const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('authorization', {
    authorize: (url) => ipcRenderer.send('authorize', url)
  // we can also expose variables, not just functions
})
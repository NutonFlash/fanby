// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  shell: {
    openExternal(url: string) {
      ipcRenderer.send('electron-shell-openExternal', url);
    },
  },
  store: {
    get(key: string, defaultValue: any) {
      return ipcRenderer.sendSync('electron-store-get', key, defaultValue);
    },
    set(property: string, val: any) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    clear() {
      ipcRenderer.send('electron-store-clear');
    },
    has(key: string) {
      return ipcRenderer.sendSync('electron-store-has', key);
    },
    delete(key: string) {
      ipcRenderer.send('electron-store-delete', key);
    },
  },
  env: {
    get(key: string) {
      return ipcRenderer.sendSync('get-env-variable', key);
    },
  },
  mainWindow: {
    minimize() {
      ipcRenderer.send('minimize-window');
    },
    maximize() {
      ipcRenderer.send('maximize-window');
    },
    restore() {
      ipcRenderer.send('restore-window');
    },
    isMaximized() {
      return ipcRenderer.sendSync('isMaximized');
    },
    close() {
      ipcRenderer.send('close-window');
    },
  },
  // Any other methods you want to expose in the window object.
  // ...
});

declare global {
  interface Window {
    electron: {
      shell: {
        openExternal: (url: string) => void;
      };
      store: {
        get: (key: string, defaultValue: any) => any;
        set: (key: string, val: any) => void;
        clear: () => void;
        has: (key: string) => any;
        delete: (key: string) => void;
      };
      env: {
        get: (key: string) => string;
      };
      mainWindow: {
        minimize: () => void;
        maximize: () => void;
        restore: () => void;
        isMaximized: () => boolean;
        close: () => void;
      };
    };
  }
}

export {};

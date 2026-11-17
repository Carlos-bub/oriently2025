import React, { createContext, useCallback, useContext, useState } from "react";
import { AppDialog, DialogConfig } from "../components/AppDialog";

interface DialogContextData {
  showDialog: (config: DialogConfig) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextData>({} as DialogContextData);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showDialog = useCallback((nextConfig: DialogConfig) => {
    setConfig(nextConfig);
    setVisible(true);
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <AppDialog visible={visible} config={config} onDismiss={hideDialog} />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog deve ser usado dentro de um DialogProvider");
  }
  return context;
}

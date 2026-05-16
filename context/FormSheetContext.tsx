"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface FormSheetContextType {
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

const FormSheetContext = createContext<FormSheetContextType | undefined>(undefined);

export function FormSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSheet = () => setIsOpen(true);
  const closeSheet = () => setIsOpen(false);

  return <FormSheetContext.Provider value={{ isOpen, openSheet, closeSheet }}>{children}</FormSheetContext.Provider>;
}

export function useFormSheet() {
  const context = useContext(FormSheetContext);
  if (!context) throw new Error("useFormSheet must be used within a FormSheetProvider!");

  return context;
}

'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';

interface UploadContextValue {
  useR2: boolean;
}

const UploadContext = createContext<UploadContextValue>({
  useR2: false,
});

export function useUploadContext() {
  return useContext(UploadContext);
}

export function UploadProvider({
  children,
  useR2 = false,
}: {
  children: React.ReactNode;
  useR2?: boolean;
}) {
  return (
    <UploadContext.Provider value={{ useR2 }}>
      {children}
    </UploadContext.Provider>
  );
}

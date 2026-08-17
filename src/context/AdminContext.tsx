import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';

const ADMIN_PIN = '1234';

interface AdminContextValue {
  unlocked: boolean;
  pinBuffer: string;
  pinPress: (digit: string) => void;
  pinBackspace: () => void;
  lock: () => void;
  resetPin: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pinBuffer, setPinBuffer] = useState('');

  const value = useMemo<AdminContextValue>(() => ({
    unlocked,
    pinBuffer,
    pinPress: (digit: string) => {
      setPinBuffer((prev) => {
        if (prev.length >= 4) return prev;
        const next = prev + digit;
        if (next.length === 4) {
          if (next === ADMIN_PIN) {
            setTimeout(() => setUnlocked(true), 100);
          } else {
            setTimeout(() => setPinBuffer(''), 350);
          }
        }
        return next;
      });
    },
    pinBackspace: () => setPinBuffer((prev) => prev.slice(0, -1)),
    lock: () => {
      setUnlocked(false);
      setPinBuffer('');
    },
    resetPin: () => setPinBuffer(''),
  }), [unlocked, pinBuffer]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within an AdminProvider');
  return ctx;
}

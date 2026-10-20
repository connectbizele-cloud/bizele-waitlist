import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

export type Role = 'creator' | 'business';

interface RoleContextValue {
  role: Role | null;
  isConfirmed: boolean;
  setRole: (role: Role) => void;
  confirmRole: () => void;
  switchRole: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

function getStored<T extends string>(key: string, valid: T[]): T | null {
  try {
    const v = sessionStorage.getItem(key);
    return valid.includes(v as T) ? (v as T) : null;
  } catch {
    return null;
  }
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(
    () => getStored('bizele_role', ['creator', 'business']),
  );
  const [isConfirmed, setIsConfirmed] = useState(
    () => getStored('bizele_role_confirmed', ['true']) === 'true',
  );

  // Ref ensures confirmRole always reads the latest role,
  // even when called from a stale closure (e.g. inside setTimeout).
  const roleRef = useRef(role);

  const setRole = useCallback((r: Role) => {
    roleRef.current = r;
    setRoleState(r);
  }, []);

  const confirmRole = useCallback(() => {
    const r = roleRef.current;
    if (!r) return;
    try {
      sessionStorage.setItem('bizele_role', r);
      sessionStorage.setItem('bizele_role_confirmed', 'true');
    } catch { /* private browsing */ }
    setIsConfirmed(true);
  }, []);

  const switchRole = useCallback(() => {
    try {
      sessionStorage.removeItem('bizele_role_confirmed');
    } catch { /* ignore */ }
    setIsConfirmed(false);
  }, []);

  return (
    <RoleContext.Provider value={{ role, isConfirmed, setRole, confirmRole, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

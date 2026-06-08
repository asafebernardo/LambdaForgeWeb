import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase, initSupabaseAuthSync } from "@/lib/supabase";

interface AuthContextValue {
  isAuthenticated: boolean;
  checked: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  checked: false,
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  const refreshAuth = useCallback(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data }) => {
        setIsAuthenticated(!!data.session);
        setChecked(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setChecked(true);
      });
  }, []);

  useEffect(() => {
    let unsubscribeSync: (() => void) | undefined;
    try {
      unsubscribeSync = initSupabaseAuthSync();
    } catch {
      setChecked(true);
      return;
    }

    refreshAuth();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setChecked(true);
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeSync?.();
    };
  }, [refreshAuth]);

  const value = useMemo(
    () => ({ isAuthenticated, checked, refreshAuth }),
    [isAuthenticated, checked, refreshAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

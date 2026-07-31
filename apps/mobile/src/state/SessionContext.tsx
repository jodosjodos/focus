import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { session } from '../api/session';

type SessionStatus = 'loading' | 'onboarding' | 'main';

interface SessionContextValue {
  status: SessionStatus;
  programId: string | null;
  establishSession: (programId: string) => void;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [programId, setProgramId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [token, storedProgramId] = await Promise.all([
        session.getToken(),
        session.getProgramId(),
      ]);

      if (token && storedProgramId) {
        setProgramId(storedProgramId);
        setStatus('main');
      } else {
        setStatus('onboarding');
      }
    })();
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      status,
      programId,
      establishSession: (newProgramId: string) => {
        setProgramId(newProgramId);
        setStatus('main');
      },
      logout: async () => {
        await session.clearAll();
        setProgramId(null);
        setStatus('onboarding');
      },
    }),
    [status, programId],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}

import { useSession as useNextAuthSession } from 'next-auth/react';

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();

  return {
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    updateSession: update,
  };
}

export default useSession;

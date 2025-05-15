'use client';

import * as Ably from 'ably';
import { ReactNode, useMemo } from 'react';
import { createContext, useContext } from 'react';

// Create an Ably context
const AblyContext = createContext<Ably.Realtime | null>(null);

interface AblyProviderProps {
  children: ReactNode;
  clientId?: string;
}

export function AblyProvider({ children, clientId }: AblyProviderProps) {
  // Only create the client when we have a clientId
  const client = useMemo(() => {
    if (!clientId) return null;
    
    return new Ably.Realtime({
      authUrl: '/api/ably-token',
      authMethod: 'GET', // Specify GET method explicitly
      clientId: clientId
    });
  }, [clientId]);
  
  if (!clientId || !client) {
    // Return children without Ably provider if no clientId is provided
    return <>{children}</>;
  }

  return (
    <AblyContext.Provider value={client}>
      {children}
    </AblyContext.Provider>
  );
}

// Hook to use Ably client
export function useAbly() {
  const client = useContext(AblyContext);
  if (!client) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  return client;
}
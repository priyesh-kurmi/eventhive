'use client';

import * as Ably from 'ably';
import { ReactNode, useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

// Create an Ably context
const AblyContext = createContext<Ably.Realtime | null>(null);

interface AblyProviderProps {
  children: ReactNode;
}

export function AblyProvider({ children }: AblyProviderProps) {
  const { data: session } = useSession();
  const [client, setClient] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    // Only create the client when we have a session user
    if (!session?.user?.id) return;

    // Create the Ably client
    const ably = new Ably.Realtime({
      authUrl: '/api/ably-token',
      authMethod: 'POST'
    });

    // Store the client in state
    setClient(ably);

    // Clean up on unmount
    return () => {
      ably.close();
    };
  }, [session?.user?.id]);

  // Always render the provider, but it might have a null value initially
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
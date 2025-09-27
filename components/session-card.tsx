'use client';

import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/hooks/useSession';

export function SessionCard() {
  const { sessionData, clearSession } = useSession();

  if (!sessionData) return null;

  return (
      <CardContent className="pt-0">
        <div className="pt-2 border-t border-violet-400/20">
          <div className="pb-2 text-xs text-violet-300 justify-center items-center text-center">
            <p className="font-medium">{sessionData.email}</p>
            <p className="text-violet-400">{sessionData.name || 'Usuario'}</p>
          </div>

          <div className="items-center text-center mt-0">
            <Button
              onClick={clearSession}
              variant="outline"
              size="sm"
              className="w-1/3 text-xs border-red-400/30 text-red-300 hover:bg-red-400/10 hover:border-red-400/50"
            >
              🚪 No soy yo
            </Button>
          </div>
        </div>
      </CardContent>
  );
}
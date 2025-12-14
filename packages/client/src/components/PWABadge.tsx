import { useRegisterSW } from 'virtual:pwa-register/react';
import duration from 'parse-duration';
import { Download, Wifi, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const PWABadge = () => {
  // check for updates every hour
  const period = duration(import.meta.env.DEV ? `10s` : `1hr`)!;

  const {
    needRefresh: [ needRefresh, setNeedRefresh ],
    offlineReady: [ offlineReady, setOfflineReady ],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) {
        return;
      }
      if (r?.active?.state === `activated`) {
        registerPeriodicSync(period, swUrl, r, setNeedRefresh);
      } else if (r?.installing) {
        r.installing.addEventListener(`statechange`, (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === `activated`) {
            registerPeriodicSync(period, swUrl, r, setNeedRefresh);
          }
        });
      }
    },
  });

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return <div className="fixed right-4 bottom-4 z-50 max-w-sm">
    <Card className="py-0 shadow-lg">
      <CardContent className="p-4">
        <Alert className="border-0 p-0">
          {needRefresh ? <Download className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          <div className="space-y-2">
            <AlertTitle className="text-sm font-medium">
              {needRefresh ? `Update Available` : `App Ready`}
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              {needRefresh ?
                `A new version is available. Please save your work and update.` :
                `App is ready to work offline`}
            </AlertDescription>
            <div className="flex gap-2 pt-2">
              {needRefresh && <Button
                size="sm"
                onClick={async () => {
                  const reg = await navigator.serviceWorker.getRegistration();
                  if (reg && reg.waiting) {
                    reg.waiting.postMessage({ type: `SKIP_WAITING` });
                    reg.waiting.addEventListener(`statechange`, (e) => {
                      if ((e.target as ServiceWorker).state === `activated`) {
                        window.location.reload();
                      }
                    });
                  } else {
                    void updateServiceWorker(true);
                  }
                }}
                className="h-7 text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                Update
              </Button>}
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="h-7 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                {offlineReady ? `Close` : `Later`}
              </Button>
            </div>
          </div>
        </Alert>
      </CardContent>
    </Card>
  </div>;
};

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
  setNeedRefresh: (value: boolean) => void,
) {
  if (period <= 0) {
    return;
  }

  setInterval(async () => {
    if (`onLine` in navigator && !navigator.onLine) {
      return;
    }

    const resp = await fetch(swUrl, {
      cache: `no-store`,
      headers: {
        'cache': `no-store`,
        'cache-control': `no-cache`,
      },
    });

    if (resp?.status === 200) {
      await r.update();
      if (r.waiting) {
        setNeedRefresh(true);
        return;
      }
    }
  }, period);
}

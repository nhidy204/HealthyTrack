// src/hooks/use-water-reminder.ts
import { useEffect, useCallback } from 'react';

const SW_TAG = 'water-reminder';
// const INTERVAL_MS = 2 * 60 * 60 * 1000;

const INTERVAL_MS = 10 * 1000; //dùng để tesst chức năng t.báo u.nước

let fallbackTimer: ReturnType<typeof setInterval> | null = null;

async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    return reg;
  } catch {
    return null;
  }
}

async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  unregister(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  periodicSync?: PeriodicSyncManager;
}

async function enablePeriodicSync(reg: ServiceWorkerRegistration): Promise<boolean> {
  try {
    const registration = reg as ServiceWorkerRegistrationWithSync;
    if (!registration.periodicSync) return false;
    await registration.periodicSync.register(SW_TAG, { minInterval: INTERVAL_MS });
    return true;
  } catch {
    return false;
  }
}
function startFallbackInterval() {
  // Dùng khi Periodic Background Sync không được hỗ trợ
  // Chỉ hoạt động khi tab đang mở
  if (fallbackTimer) clearInterval(fallbackTimer);
  fallbackTimer = setInterval(() => {
    if (Notification.permission === 'granted') {
      new Notification('💧 Nhắc uống nước', {
        body: 'Đã đến giờ uống nước rồi! Uống 1 ly nhé.',
        icon: '/favicon.svg',
        tag: SW_TAG,
      });
    }
  }, INTERVAL_MS);
}

function stopFallbackInterval() {
  if (fallbackTimer) {
    clearInterval(fallbackTimer);
    fallbackTimer = null;
  }
}

async function unregisterPeriodicSync() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const registration = reg as ServiceWorkerRegistrationWithSync;
    if (registration.periodicSync) {
      await registration.periodicSync.unregister(SW_TAG);
    }
  } catch {
    //error network ignore
  }
}

export function useWaterReminder(enabled: boolean) {
  const enable = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) {
      alert('Bạn cần cấp quyền thông báo để nhận nhắc nhở uống nước.');
      return;
    }

    const reg = await registerSW();
    if (!reg) {
      startFallbackInterval();
      return;
    }

    const periodicOk = await enablePeriodicSync(reg);
    if (!periodicOk) {
      // Periodic Background Sync không được hỗ trợ → fallback interval
      startFallbackInterval();
    }

    localStorage.setItem('water-reminder', 'true');
  }, []);

  const disable = useCallback(async () => {
    stopFallbackInterval();
    await unregisterPeriodicSync();
    localStorage.removeItem('water-reminder');
  }, []);

  useEffect(() => {
    if (enabled) {
      enable();
    } else {
      disable();
    }
    return () => {
      // Không tắt khi unmount — chỉ tắt khi user toggle off
    };
  }, [enabled, enable, disable]); 

  // Lắng nghe message từ SW khi user bấm "Đã uống"
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'WATER_LOGGED') {
        // Có thể trigger log water API ở đây
        console.log('User đã uống nước từ notification!');
      }
    };
    navigator.serviceWorker?.addEventListener('message', handler);
    return () => navigator.serviceWorker?.removeEventListener('message', handler);
  }, []);
}

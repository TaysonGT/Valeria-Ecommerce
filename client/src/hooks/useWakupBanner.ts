// hooks/useWakeUpBanner.ts
import { useEffect, useState } from 'react';
import { wakeUpState } from '../utils/axios.config';

export function useWakeUpBanner() {
  const [isWaking, setIsWaking] = useState(false);

  useEffect(() => {
    wakeUpState.listeners.add(setIsWaking);
    return () => { wakeUpState.listeners.delete(setIsWaking) };
  }, []);
  return isWaking;
}
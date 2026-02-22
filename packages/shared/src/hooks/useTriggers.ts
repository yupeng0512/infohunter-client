import { useMutation } from '@tanstack/react-query';
import { triggerSmartCollect, triggerDailyReport } from '../api/endpoints';

export function useTriggerSmartCollect() {
  return useMutation({ mutationFn: triggerSmartCollect });
}

export function useTriggerDailyReport() {
  return useMutation({ mutationFn: triggerDailyReport });
}

import { useT } from '@/i18n';
import { Button, EmptyState } from './ui';

/** Lỗi truy cập dữ liệu khác với một ID không tồn tại; cho phép thử lại. */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  const t = useT();
  return (
    <EmptyState
      icon="alert-circle-outline"
      message={t('loadFailed')}
      action={<Button title={t('retry')} onPress={onRetry} />}
    />
  );
}

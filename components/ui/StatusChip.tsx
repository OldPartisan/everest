import { cn } from '@/lib/format';
import type { HistoryItem } from '@/lib/schema';

type Status = HistoryItem['status'];

const labels: Record<Status, string> = {
  confirmed: 'Подтверждено',
  disputed: 'Оспаривается',
  unconfirmed: 'Не подтверждено',
};

type StatusChipProps = {
  status: Status;
  label?: string;
  className?: string;
};

export default function StatusChip({ status, label, className }: StatusChipProps) {
  return (
    <span className={cn('status-chip', className)} data-status={status}>
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'confirmed' ? 'bg-ink-1' : 'bg-accent',
        )}
        aria-hidden="true"
      />
      {label ?? labels[status]}
    </span>
  );
}

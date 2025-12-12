import { SortType, SortOrder, FilterType } from '@/hooks/useTodos';
import styles from '../app/page.module.css';

interface TodoSortProps {
  sortType: SortType;
  sortOrder: SortOrder;
  filterType: FilterType;
  onSortTypeChange: (type: SortType) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onFilterTypeChange: (type: FilterType) => void;
}

const sortTypeLabels: Record<SortType, string> = {
  createdAt: '作成日時',
  priority: '優先順位',
  text: 'テキスト',
  completed: '完了状態',
};

const filterTypeLabels: Record<FilterType, string> = {
  all: 'すべて',
  active: '未完了',
  completed: '完了',
};

export function TodoSort({
  sortType,
  sortOrder,
  filterType,
  onSortTypeChange,
  onSortOrderChange,
  onFilterTypeChange,
}: TodoSortProps) {
  return (
    <div className={styles.sortControls}>
      <label className={styles.sortLabel}>
        フィルター:
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as FilterType)}
          className={styles.sortSelect}
          aria-label="フィルター"
        >
          <option value="all">すべて</option>
          <option value="active">未完了</option>
          <option value="completed">完了</option>
        </select>
      </label>
      <label className={styles.sortLabel}>
        並び替え:
        <select
          value={sortType}
          onChange={(e) => onSortTypeChange(e.target.value as SortType)}
          className={styles.sortSelect}
          aria-label="ソートタイプ"
        >
          <option value="createdAt">作成日時</option>
          <option value="priority">優先順位</option>
          <option value="text">テキスト</option>
          <option value="completed">完了状態</option>
        </select>
      </label>
      <button
        onClick={() =>
          onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
        }
        className={styles.sortOrderButton}
        aria-label={`${sortOrder === 'asc' ? '降順' : '昇順'}に変更`}
      >
        {sortOrder === 'asc' ? '↑ 昇順' : '↓ 降順'}
      </button>
    </div>
  );
}


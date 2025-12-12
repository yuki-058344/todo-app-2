import { useState, KeyboardEvent } from 'react';
import { Priority } from '@/types/todo';
import styles from '../app/page.module.css';

interface TodoFormProps {
  onAddTodo: (text: string, priority: Priority) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = () => {
    if (inputText.trim() === '') return;
    onAddTodo(inputText, priority);
    setInputText('');
    setPriority('medium');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.form}>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="新しいTODOを入力..."
        className={styles.input}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className={styles.prioritySelect}
        aria-label="優先順位"
      >
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <button onClick={handleSubmit} className={styles.button}>
        追加
      </button>
    </div>
  );
}


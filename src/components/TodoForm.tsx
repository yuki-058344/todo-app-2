import { useState, KeyboardEvent } from 'react';
import styles from '../app/page.module.css';

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim() === '') return;
    onAddTodo(inputText);
    setInputText('');
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
      <button onClick={handleSubmit} className={styles.button}>
        追加
      </button>
    </div>
  );
}


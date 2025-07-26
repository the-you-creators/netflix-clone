import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: Component<SearchBarProps> = (props) => {
  const [query, setQuery] = createSignal('');

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setQuery(value);
    props.onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    props.onSearch('');
  };

  return (
    <div class="search-bar">
      <div class="search-input-container">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="search-input"
          placeholder={props.placeholder || '動画を検索...'}
          value={query()}
          onInput={handleInput}
        />
        {query() && (
          <button class="clear-button" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export const searchBarStyles = `
  .search-bar {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    padding: 0 20px;
    transition: all 0.3s;
  }

  .search-input-container:focus-within {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.3);
  }

  .search-icon {
    font-size: 18px;
    margin-right: 10px;
    opacity: 0.7;
  }

  .search-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
    padding: 12px 0;
    placeholder-color: rgba(255, 255, 255, 0.5);
  }

  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .clear-button {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    cursor: pointer;
    padding: 5px;
    margin-left: 10px;
    transition: color 0.2s;
  }

  .clear-button:hover {
    color: white;
  }

  @media (max-width: 768px) {
    .search-bar {
      max-width: 100%;
      padding: 15px;
    }

    .search-input {
      font-size: 14px;
    }
  }
`;
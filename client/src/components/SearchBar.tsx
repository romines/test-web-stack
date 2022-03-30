import React from 'react';

interface IProps {
  initialQuery: string;
  updateUrl: (s: string) => void;
}

export default function SearchBar({ updateUrl, initialQuery }: IProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateUrl(e.target.value);
  };
  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(e) => handleChange(e)}
        value={initialQuery}
        tabIndex={1}
      />
    </div>
  );
}

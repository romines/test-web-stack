import React from 'react';

import  { SearchParams } from './UserManager';

interface IProps {
  initialQuery: string;
  updateUrl: (params: SearchParams) => void;
}

export default function SearchBar({ updateUrl, initialQuery }: IProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateUrl({ q: e.target.value });
  };
  return (
    <div>
      <input
        placeholder="Search..."
        id="userSearch"
        onChange={(e) => handleChange(e)}
        value={initialQuery}
        tabIndex={1}
      />
    </div>
  );
}

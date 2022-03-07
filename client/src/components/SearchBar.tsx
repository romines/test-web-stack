import React from 'react';

interface IProps {
  initialQuery: string | undefined;
  updateUrl: (s: string) => void;
}

export default function SearchBar({ updateUrl, initialQuery }: IProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    updateUrl(e.target.value);
  };
  return (
    <div>
      <input onChange={(e) => handleChange(e)} value={initialQuery} />
    </div>
  );
}

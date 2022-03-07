import './App.css';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import SearchBar from './components/SearchBar';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = searchParams.get('offset');
  const limit = searchParams.get('limit');
  const pageNumber = offset && limit ? parseInt(offset) / parseInt(limit) + 1 : 'one';
  const updateUrl = (userQuery: string): void => {
    setSearchParams({ q: userQuery });
  };
  const initialQuery = searchParams.get('q') ?? undefined;
  return (
    <div className="App">
      <h1>Users</h1>
      <SearchBar updateUrl={updateUrl} initialQuery={initialQuery} />
      <nav
        style={{
          borderBottom: 'solid 1px',
          paddingBottom: '1rem',
        }}
      >
        <Link to="/?q=johny+user">Search term</Link> | <Link to="/?limit=9&offset=9">Page two</Link>{' '}
        | <Link to="/?limit=9&offset=18">Page three</Link> |
      </nav>

      <div>Search term: {searchParams.get('q')}</div>
      <div>Current page: {pageNumber}</div>
    </div>
  );
}

export default App;

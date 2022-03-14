import './styles.scss';

import SearchBar from 'components/SearchBar';
import UserCard from 'components/UserCard';
import { useGetUsersQuery } from 'graphql/_generated';
import { useSearchParams } from 'react-router-dom';

export default function UserManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? undefined;
  const updateUrl = (userQuery: string): void => {
    setSearchParams({ q: userQuery });
  };
  const offset = searchParams.get('offset');
  const limit = searchParams.get('limit');
  const pageNumber = offset && limit ? parseInt(offset) / parseInt(limit) + 1 : 'one';

  const { data, loading, error } = useGetUsersQuery();

  if (loading) {
    return <div>loading...</div>;
  } else if (error) {
    return <div>oops: {error.message}</div>;
  }

  return (
    <div className="user-manager">
      <h1>Users list</h1>

      <SearchBar updateUrl={updateUrl} initialQuery={initialQuery} />
      <div className="card-container">
        {data?.users?.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>

      <div>Search term: {searchParams.get('q')}</div>
      <div>Current page: {pageNumber}</div>
    </div>
  );
}

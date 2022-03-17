import './styles.scss';

import { Modal, SearchBar, UserCard, UserForm } from 'components';
import { useGetUsersQuery } from 'graphql/_generated';
import { User } from 'graphql/_generated';
import { useState } from 'react';
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

  const [currentlyEditingUserId, setCurrentlyEditingUserId] = useState<string | null>(null);
  const [currentlyEditingUser] = data?.users.filter(
    (u: User) => u.id === currentlyEditingUserId
  ) ?? [null];

  if (loading) {
    return <div>loading...</div>;
  } else if (error) {
    return <div>oops: {error.message}</div>;
  }

  return (
    <div className="user-manager">
      <div className="inner-container">
        <div className="top-bar">
          <h1>Users</h1>
          <SearchBar updateUrl={updateUrl} initialQuery={initialQuery} />
        </div>

        <div className="card-container">
          {data?.users?.map((user, i) => (
            <UserCard
              user={user}
              key={user.id}
              tabIndex={i + 2}
              setCurrentlyEditingUserId={setCurrentlyEditingUserId}
            />
          ))}
        </div>

        <div>Search term: {searchParams.get('q')}</div>
        <div>Current page: {pageNumber}</div>
      </div>
      <Modal
        showModal={!!currentlyEditingUserId}
        closeModal={() => setCurrentlyEditingUserId(null)}
      >
        {currentlyEditingUser && <UserForm user={currentlyEditingUser} />}
      </Modal>
    </div>
  );
}

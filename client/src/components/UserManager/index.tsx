import './styles.scss';

import { EditModal, SearchBar, UserCard } from 'components';
import { useGetUsersQuery } from 'graphql/_generated';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// interface Iprops {
//   onModalToggle: () => void;
// }

export default function UserManager() {
  const [showModal, setShowModal] = useState(false);
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
  const beginEditUser = () => {
    setShowModal(true);
  };

  return (
    <div className="user-manager">
      <div className="inner-container">
        <div className="top-bar">
          <h1>Users list</h1>
          <SearchBar updateUrl={updateUrl} initialQuery={initialQuery} />
        </div>

        <div className="card-container">
          {data?.users?.map((user, i) => (
            <UserCard user={user} key={user.id} tabIndex={i + 2} beginEditUser={beginEditUser} />
          ))}
        </div>

        <div>Search term: {searchParams.get('q')}</div>
        <div>Current page: {pageNumber}</div>
      </div>
      <EditModal showModal={showModal} />
    </div>
  );
}

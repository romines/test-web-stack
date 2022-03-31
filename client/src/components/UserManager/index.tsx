import './styles.scss';

import { Modal, SearchBar, UserCard, UserFields, UserForm, UserLocation } from 'components';
import {
  useGetPhotosQuery,
  useGetUsersQuery,
  User,
  useUpdateUserMutation,
} from 'graphql/_generated';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface SearchParams {
  q?: string;
  page?: string;
}

export default function UserManager() {
  /*
   *
   * Data fetching / persistence
   *
   *
   */

  // Handle user search and pagination with query string
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const updateUrl = (updatedSearchParams: SearchParams): void => {
    const current = Object.fromEntries(searchParams.entries()) ?? {};
    const merged = { ...current, ...updatedSearchParams };
    setSearchParams(Object.entries(merged));
  };
  const page = parseInt(searchParams.get('page') ?? '1');
  const searchUsersQuery = searchParams.get('q');

  // user data graphql query
  const {
    data: userData,
    loading: usersLoading,
    error: usersError,
  } = useGetUsersQuery({
    variables: { page, ...(searchUsersQuery ? { search: searchUsersQuery } : {}) },
  });

  const users = userData?.users?.users ?? [];
  const count = userData?.users?.count ?? 0;

  // photos graphql query
  const { data: photoData, loading: photosLoading, error: photosError } = useGetPhotosQuery();
  const photos = photoData?.getPhotos.map(({ url }) => url) || [];

  // user update mutation
  const [updateUserMutation] = useUpdateUserMutation();

  // scroll the last user card into view in order to save users place on page reload
  // (disable for fist page load and around filter/search)
  const shouldScrollTo = (i: number): boolean => {
    return !!(
      users?.length !== 6 &&
      i === users?.length - 1 &&
      document.activeElement?.id !== 'userSearch'
    );
  };

  /*
   *
   * Local state and user editing
   *
   *
   */
  const [currentlyEditingUserId, setCurrentlyEditingUserId] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [currentlyEditingUser] = users.filter((u: User) => u.id === currentlyEditingUserId) ?? [
    null,
  ];

  const updateUser = (updatedUserData: UserFields) => {
    updateUserMutation({
      variables: {
        data: updatedUserData,
        updateUserId: currentlyEditingUserId as string,
      },
    });
    setCurrentlyEditingUserId(null);
  };

  useEffect(() => {
    if (currentlyEditingUserId) {
      setUserAddress(currentlyEditingUser?.address as string);
    }
  }, [currentlyEditingUserId, currentlyEditingUser?.address]);

  /*
   *
   * Rendering
   *
   *
   */

  if (usersError || photosError) {
    return <h1>oops: {[usersError?.message, photosError?.message].filter(Boolean).join(', ')}</h1>;
  }

  return (
    <div className="user-manager">
      <div className="inner-container">
        <div className="top-bar">
          <h1>Users list</h1>
          <SearchBar updateUrl={updateUrl} initialQuery={initialQuery} />
        </div>

        {usersLoading || photosLoading ? (
          <div>loading...</div>
        ) : (
          <div className="card-container">
            {users?.map((user, i) => (
              <UserCard
                user={user}
                photo={photos[parseInt(user.id)]}
                key={user.id}
                tabIndex={i + 2}
                setCurrentlyEditingUserId={setCurrentlyEditingUserId}
                scrollTo={shouldScrollTo(i)}
              />
            ))}
          </div>
        )}

        <div className="bottom-bar">
          {count > users.length && (
            <button className="load-more" onClick={() => updateUrl({ page: `${page + 1}` })}>
              Load More
            </button>
          )}
        </div>
      </div>
      <Modal
        showModal={!!currentlyEditingUserId}
        closeModal={() => setCurrentlyEditingUserId(null)}
      >
        {currentlyEditingUser && (
          <div className="edit-container">
            <h1>Edit user</h1>
            <div className="inner-container">
              <UserLocation address={userAddress} />
              <UserForm
                user={currentlyEditingUser}
                updateUser={updateUser}
                setUserAddress={setUserAddress}
                cancel={() => setCurrentlyEditingUserId(null)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

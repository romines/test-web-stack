import './styles.scss';

import { Modal, SearchBar, UserCard, UserFields, UserForm, UserLocation } from 'components';
import { useGetPhotosQuery, useGetUsersQuery } from 'graphql/_generated';
import { User } from 'graphql/_generated';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface SearchParams {
  q?: string;
  page?: number;
}

export default function UserManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const updateUrl = (updatedSearchParams: SearchParams): void => {
    setSearchParams({ ...searchParams, ...updatedSearchParams });
  };
  const page = parseInt(searchParams.get('page') ?? '1');
  const searchUsersQuery = searchParams.get('q');

  const {
    data: userData,
    loading: usersLoading,
    error: usersError,
  } = useGetUsersQuery({ variables: { search: searchUsersQuery, page } });
  const { data: photoData, loading: photosLoading, error: photosError } = useGetPhotosQuery();
  const photos = photoData?.getPhotos.map(({ url }) => url) || [];

  const shouldScrollTo = (i: number): boolean => {
    // scroll the last user card into view in order to save users place on page reload
    // (disable for fist page load and around filter/search)
    return !!(
      userData &&
      userData?.users?.length !== 6 &&
      i === userData?.users?.length - 1 &&
      document.activeElement?.id !== 'userSearch' &&
      !searchUsersQuery
    );
  };

  const [currentlyEditingUserId, setCurrentlyEditingUserId] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [currentlyEditingUser] = userData?.users.filter(
    (u: User) => u.id === currentlyEditingUserId
  ) ?? [null];

  const updateUser = ({ name, address, description }: UserFields) => {
    console.log({ name, address, description });
    setCurrentlyEditingUserId(null);
  };

  useEffect(() => {
    if (currentlyEditingUserId) {
      setUserAddress(currentlyEditingUser?.address as string);
    }
  }, [currentlyEditingUserId, currentlyEditingUser?.address]);

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
            {userData?.users?.map((user, i) => (
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
          <button className="load-more" onClick={() => updateUrl({ page: page + 1 })}>
            Load More
          </button>
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

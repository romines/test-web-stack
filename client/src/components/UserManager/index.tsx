import './styles.scss';

import { Modal, SearchBar, UserCard, UserFields, UserForm, UserLocation } from 'components';
import { useGetPhotosQuery, useGetUsersQuery } from 'graphql/_generated';
import { User } from 'graphql/_generated';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function UserManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const updateUrl = (userQuery: string): void => {
    setSearchParams({ q: userQuery });
  };
  const offset = searchParams.get('offset');
  const limit = searchParams.get('limit');
  const pageNumber = offset && limit ? parseInt(offset) / parseInt(limit) + 1 : 'one';

  const { data: userData, loading: usersLoading, error: usersError } = useGetUsersQuery();
  const { data: photoData, loading: photosLoading, error: photosError } = useGetPhotosQuery();

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

  if (usersLoading || photosLoading) {
    return <div>loading...</div>;
  } else if (usersError || photosError) {
    return (
      <div>oops: {[usersError?.message, photosError?.message].filter(Boolean).join(', ')}</div>
    );
  }

  const photos = photoData?.getPhotos.map(({ url }) => url) || [];
  return (
    <div className="user-manager">
      <div className="inner-container">
        <div className="top-bar">
          <h1>Users list</h1>
          <SearchBar updateUrl={updateUrl} initialQuery={initialQuery} />
        </div>

        <div className="card-container">
          {userData?.users?.map((user, i) => (
            <UserCard
              user={user}
              photo={photos[i]}
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
        {currentlyEditingUser && (
          <div className="edit-container">
            <h1>Users list</h1>
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

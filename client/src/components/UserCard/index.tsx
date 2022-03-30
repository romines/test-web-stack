import './styles.scss';

import { format } from 'date-fns';
import { User } from 'graphql/_generated';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import editIcon from './edit_icon.svg';

interface IProps {
  user: User;
  photo: string;
  tabIndex: number;
  setCurrentlyEditingUserId: Dispatch<SetStateAction<string | null>>;
  scrollTo: boolean;
}

export default function UserCard({
  user,
  photo,
  tabIndex,
  setCurrentlyEditingUserId,
  scrollTo,
}: IProps) {
  const onEditClick = () => {
    setCurrentlyEditingUserId(user.id);
  };

  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    if (scrollTo && containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  }, [scrollTo]);

  // allow modal launch with enter key
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      // using DOM APIs feels OK here because it is raw DOM events we care about
      document.addEventListener('keydown', function handler(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          setCurrentlyEditingUserId(null);
          document.removeEventListener('keydown', handler);
        }
      });
      setCurrentlyEditingUserId(user.id);
    }
  };

  const formattedDate = format(new Date(user.createdAt), 'dd MMM yyyy');

  return (
    <div
      className="user-card"
      tabIndex={tabIndex}
      onKeyDown={(e) => handleEnterKeyDown(e)}
      ref={containerRef}
    >
      <div className="inner-container">
        <div className="top-bar">
          <img src={editIcon} alt="Edit user" className="edit-icon" onClick={onEditClick} />
        </div>
        <div className="photo-container">
          <img src={photo} alt="Avatar" className="user-photo" />
        </div>
        <div className="name-row">
          <span className="name">{user.name}</span>
          <span className="created">
            created
            <span className="created-date">&nbsp;{formattedDate}</span>
          </span>
        </div>
        <div className="description">{user.description}</div>
      </div>
    </div>
  );
}

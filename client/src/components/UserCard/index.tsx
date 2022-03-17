import './styles.scss';

import { User } from 'graphql/_generated';
import { Dispatch, SetStateAction } from 'react';

import editIcon from './edit_icon.svg';

interface IProps {
  user: User;
  tabIndex: number;
  setCurrentlyEditingUserId: Dispatch<SetStateAction<string | null>>;
}

export default function UserCard({ user, tabIndex, setCurrentlyEditingUserId }: IProps) {
  const onEditClick = () => {
    setCurrentlyEditingUserId(user.id);
  };

  return (
    <div className="user-card" tabIndex={tabIndex}>
      <div className="inner-container">
        <img src={editIcon} alt="Edit user" className="edit-icon" onClick={onEditClick} />
      </div>
    </div>
  );
}

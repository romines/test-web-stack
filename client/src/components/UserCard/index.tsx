import './styles.scss';

import { User } from 'graphql/_generated';

import editIcon from './edit_icon.svg';

interface IProps {
  user: User;
  tabIndex: number;
  beginEditUser: () => void;
}

export default function UserCard({ user, tabIndex, beginEditUser }: IProps) {
  return (
    <div className="user-card" tabIndex={tabIndex}>
      <div className="inner-container">
        <img src={editIcon} alt="Edit user" className="edit-icon" onClick={beginEditUser} />
      </div>
    </div>
  );
}

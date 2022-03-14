import './styles.scss';

import { User } from 'graphql/_generated';

interface IProps {
  user: User;
}

export default function UserCard({ user }: IProps) {
  return <div className="user-card">name: {user.name}</div>;
}

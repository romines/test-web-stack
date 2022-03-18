import './styles.scss';

import { User } from 'graphql/_generated';

import { UserFields, userKeys } from '..';

interface IProps {
  user: User;
  cancel: () => void;
  updateUser: (u: UserFields) => void;
}

export default function UserForm({ user, updateUser, cancel }: IProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const [name, address, description] = userKeys.map((p) => formData.get(p) as string);
    updateUser({ name, address, description });
  };
  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" defaultValue={user.name} />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input type="text" name="address" defaultValue={user.address} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input type="text" name="description" defaultValue={user.description} />
      </div>

      <input type="submit" />
      <button onClick={cancel}>Cancel</button>
    </form>
  );
}

import './styles.scss';

import { User } from 'graphql/_generated';

interface IProps {
  user: User;
}

export default function UserForm({ user }: IProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const [name, address, description] = ['name', 'address', 'description'].map((p) =>
      formData.get(p)
    );
  };
  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={user.name} />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input type="text" name="address" value={user.address} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input type="text" name="description" value={user.description} />
      </div>

      <input type="submit" />
      <button>Cancel</button>
    </form>
  );
}

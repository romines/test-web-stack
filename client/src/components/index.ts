export { default as Modal } from './Modal';
export { default as SearchBar } from './SearchBar';
export { default as UserCard } from './UserCard';
export { default as UserForm } from './UserForm';
export { default as UserManager } from './UserManager';
const exampleUserFields = { name: '', address: '', description: '' };
export type UserFields = typeof exampleUserFields;
export const userKeys = Object.keys(exampleUserFields);

import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($search: String, $page: Float!) {
    users(search: $search, page: $page) {
      name
      id
      dob
      address
      description
      photo {
        url
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($userInput: NewUserInput!) {
    addUser(userInput: $userInput) {
      id
      name
      dob
      address
      description
      photo {
        url
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UpdateUserInput!, $updateUserId: String!) {
    updateUser(data: $data, id: $updateUserId) {
      id
      name
      dob
      address
      description
      photo {
        url
      }
    }
  }
`;

export const GET_PHOTOS = gql`
  query GetPhotos {
    getPhotos {
      url
      id
    }
  }
`;

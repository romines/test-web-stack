import './App.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import UserManager from './components/UserManager';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <UserManager />
      </div>
    </ApolloProvider>
  );
}

export default App;

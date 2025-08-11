import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql', // Ajusta esta URL
  cache: new InMemoryCache(),
});

export default client;
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { UserResolver } from './resolvers/userResolver';

async function main() {
  await createConnection({
    type: 'sqlite',
    database: './db.sqlite3',
    entities: ['./src/models/*.ts'],
    synchronize: true,
  });
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
  });

  const app = Express();

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  server.applyMiddleware({ app });

  app.listen(4000, () => console.log('Server is running on http://localhost:4000/graphql'));
}

main();

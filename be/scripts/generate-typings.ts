
import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'node:path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: [join(__dirname, '../src/schema.gql')],
  path: join(__dirname, '../src/graphql.ts'),
  outputAs: 'class',
});


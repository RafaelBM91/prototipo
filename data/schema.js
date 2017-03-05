import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { CompromisoType, CompromisoMutation } from './shemas/compromiso';
import { PagoType } from './shemas/pago';

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    compromiso: {
      type: CompromisoType,
      resolve: () => CompromisoType,
    },
    movimientos: {
      type: PagoType,
      resolve: () => PagoType,
    },
  })
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    CompromisoMutation: CompromisoMutation,
  })
});

export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

/*

*/

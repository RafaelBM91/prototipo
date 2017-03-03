import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

import { resolveArrayData } from 'sequelize-relay';

import uuid from 'uuid';

import models from '../database';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

export const ArticuloModel = new GraphQLObjectType({
  name: 'ArticuloModel',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: ({id}) => id.toString(),
    },
    descripcion: {
      type: GraphQLString,
    },
    precio: {
      type: GraphQLFloat,
    },
    stock: {
      type: GraphQLInt,
    },
  })
});

export const ArticuloType = new GraphQLObjectType({
  name: 'ArticuloType',
  fields: () => ({
    articulos: {
      type: new GraphQLList(ArticuloModel),
      args: {
        descripcion: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (root,{descripcion}) => resolveArrayData(models.articulo.findAll({
        where: {
          descripcion: {$like: `%${descripcion}%`}
        }
      })),
    },
    codigo: {
      type: GraphQLString,
      resolve: () => uuid(),
    },
  }),
});

export const ArticuloInput = new GraphQLInputObjectType({
  name: 'ArticuloInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    descripcion: { type: new GraphQLNonNull(GraphQLString) },
    precio: { type: new GraphQLNonNull(GraphQLFloat) },
    stock: { type: new GraphQLNonNull(GraphQLInt) },
  }
});

export const ArticuloMutation = mutationWithClientMutationId({
  name: 'ArticuloMutation',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    descripcion: { type: new GraphQLNonNull(GraphQLString) },
    precio: { type: new GraphQLNonNull(GraphQLFloat) },
    stock: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    articulos: {
      type: new GraphQLList(ArticuloModel),
      resolve: () => resolveArrayData(models.articulo.findAll()),
    }
  },
  mutateAndGetPayload: ({id,descripcion,precio,stock}) => {
    models.articulo.findOne({where: {id}}).then((objeto) => {
      if (objeto) {
        return objeto.update({id,descripcion,precio,stock});
      } else {
        return models.articulo.create({descripcion,precio,stock});
      }
    });
    return {id,descripcion,precio,stock};
  },
});

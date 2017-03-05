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

import models from '../database';

import { ArticuloModel } from './articulos';

export const DetalleModel = new GraphQLObjectType({
  name: 'DetalleModel',
  fields: () => ({
    codigo: {
      type: GraphQLString,
    },
    cantidad: {
      type: GraphQLInt,
    },
    unidadPrecio: {
      type: GraphQLFloat,
    },
    totalPrecio: {
      type: GraphQLFloat,
    },
    articulo: {
      type: ArticuloModel,
      resolve: (_,{}) => models.articulo.findOne({
        where: {
          id: {$eq: _.articuloId}
        }
      }),
    }
  })
});

export const DetalleInput = new GraphQLInputObjectType({
  name: 'DetalleInput',
  fields: {
    cantidad: { type: new GraphQLNonNull(GraphQLInt) },
    unidadPrecio: { type: new GraphQLNonNull(GraphQLFloat) },
    articuloId: { type: new GraphQLNonNull(GraphQLInt) },
  }
});

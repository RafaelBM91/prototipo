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

import GraphQLDate from 'graphql-date';

import { resolveArrayData } from 'sequelize-relay';

import models from '../database';

import { CompromisoModel } from './compromiso';

export const PagoModel = new GraphQLObjectType({
  name: 'PagoModel',
  fields: () => ({
    codigo: {
      type: GraphQLString,
    },
    pago: {
      type: GraphQLFloat,
    },
    createdAt: {
      type: GraphQLDate,
    },
    compromiso: {
      type: CompromisoModel,
      resolve: (_,{}) =>
        models.compromiso.findOne({
          where: {codigo: {$like: _.compromisoCodigo}}
        }),
    },
  })
});

export const PagoType = new GraphQLObjectType({
  name: 'PagoType',
  fields: () => ({
    pagos: {
      type: new GraphQLList(PagoModel),
      args: {
        desde: {
          type: new GraphQLNonNull(GraphQLDate),
        },
        hasta: {
          type: new GraphQLNonNull(GraphQLDate),
        },
      },
      resolve: (_,{desde,hasta}) => {
        console.log('\n\n');
        console.log(
          hasta
        );
        console.log('\n\n');
        return resolveArrayData(models.pago.findAll({
          where: {createdAt: {$gte: desde, $lte: hasta}}
        }))
      },
    },
  }),
});

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import GraphQLDate from 'graphql-date';

import { resolveArrayData } from 'sequelize-relay';

import uuid from 'uuid';

import models from '../database';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import { ClienteType, ClienteInput } from './cliente';

import { ArticuloType, ArticuloInput } from './articulos';

export const CompromisoModel = new GraphQLObjectType({
  name: 'CompromisoModel',
  fields: () => ({
    codigo: {
      type: GraphQLString,
    },
    total: {
      type: GraphQLFloat,
    },
    tipo: {
      type: GraphQLString,
    },
    anulado: {
      type: GraphQLBoolean,
    },
    createAt: {
      type: GraphQLDate,
    },
    clienteCedula: {
      type: GraphQLString,
    },
  })
});

export const CompromisoType = new GraphQLObjectType({
  name: 'CompromisoType',
  fields: () => ({
    cliente: {
      type: ClienteType,
      resolve: () => ClienteType,
    },
    articulos: {
      type: ArticuloType,
      resolve: () => ArticuloType,
    },
    compromiso: {
      type: new GraphQLList(CompromisoModel),
    },
    codigo: {
      type: GraphQLString,
      resolve: () => uuid(),
    },
  }),
});

export const CompromisoMutation = mutationWithClientMutationId({
  name: 'CompromisoMutation',
  inputFields: {
    cliente: { type: ClienteInput },
    // articulos: { type: new GraphQLList(ArticuloInput) },

  },
  outputFields: {
    compromiso: {
      type: CompromisoType,
      resolve: () => CompromisoType,
    }
  },
  mutateAndGetPayload: ({cliente}) => {
    let { cedula, nombre, telefono } = cliente;
    models.cliente.findOne({where: {cedula}}).then((objeto) => {
      if (objeto) {
        return objeto.update({nombre,telefono});
      } else {
        return models.cliente.create({cedula,nombre,telefono});
      }
    });

    return true;
  },
});

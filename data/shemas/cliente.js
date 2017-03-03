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

export const ClienteModel = new GraphQLObjectType({
  name: 'ClienteModel',
  fields: () => ({
    cedula: {
      type: GraphQLString,
    },
    nombre: {
      type: GraphQLString,
    },
    telefono: {
      type: GraphQLString,
    },
  })
});

export const ClienteType = new GraphQLObjectType({
  name: 'ClienteType',
  fields: () => ({
    cliente: {
      type: new GraphQLList(ClienteModel),
      args: {
        cedula: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve(root,{cedula}) {
        return resolveArrayData(models.cliente.findAll({where: {cedula}}))
      },
    },
    codigo: {
      type: GraphQLString,
      resolve: () => uuid(),
    },
  }),
});

export const ClienteInput = new GraphQLInputObjectType({
  name: 'ClienteInput',
  fields: {
    cedula: { type: new GraphQLNonNull(GraphQLString) },
    nombre: { type: new GraphQLNonNull(GraphQLString) },
    telefono: { type: GraphQLString },
  }
});

export const ClienteMutation = mutationWithClientMutationId({
  name: 'ClienteMutation',
  inputFields: {
    cedula: { type: new GraphQLNonNull(GraphQLString) },
    nombre: { type: new GraphQLNonNull(GraphQLString) },
    telefono: { type: GraphQLString },
  },
  outputFields: {
    cliente: {
      type: new GraphQLList(ClienteModel),
      resolve: () => resolveArrayData(models.cliente.findAll({where: {cedula}}))
    }
  },
  mutateAndGetPayload: ({cedula,nombre,telefono}) => {
    models.cliente.findOne({where: {cedula}}).then((objeto) => {
      if (objeto) {
        return objeto.update({cedula,nombre,telefono});
      } else {
        return models.cliente.create({cedula,nombre,telefono});
      }
    });
    return {cedula,nombre,telefono};
  },
});
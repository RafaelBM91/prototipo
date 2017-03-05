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

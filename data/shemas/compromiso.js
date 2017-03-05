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

import uuid from 'uuid';

import models from '../database';

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import { ClienteModel, ClienteType, ClienteInput } from './cliente';

import { ArticuloType } from './articulos';

import { DetalleModel, DetalleInput } from './detalle';

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
    createdAt: {
      type: GraphQLDate,
    },
    cliente: {
      type: ClienteModel,
      resolve: (_,{}) => models.cliente.findOne({
        where: {cedula: {$like: _.clienteCedula}}
      }),
    },
    detalles: {
      type: new GraphQLList(DetalleModel),
      resolve: (_,{}) => resolveArrayData(models.detalle.findAll({
        where: {compromisoCodigo: {$like: _.codigo}}
      })),
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
    todo: {
      type: new GraphQLList(CompromisoModel),
      resolve: () => resolveArrayData(models.compromiso.findAll()),
    },
    movimientos: {
      type: new GraphQLList(CompromisoModel),
      args: {
        desde: {
          type: new GraphQLNonNull(GraphQLDate),
        },
        hasta: {
          type: new GraphQLNonNull(GraphQLDate),
        },
      },
      resolve: (_,{desde,hasta}) =>
        resolveArrayData(models.compromiso.findAll({
          where: {createdAt: {$gte: desde, $lte: hasta}}
        })),
    },
    codigo: {
      type: GraphQLString,
      resolve: () => uuid(),
    },
  }),
});

export const CompromisoInput = new GraphQLInputObjectType({
  name: 'CompromisoInput',
  fields: {
    tipo: { type: new GraphQLNonNull(GraphQLString) },
  }
});

export const CompromisoMutation = mutationWithClientMutationId({
  name: 'CompromisoMutation',
  inputFields: {
    cliente: { type: ClienteInput },
    detalles: { type: new GraphQLList(DetalleInput) },
    compromiso: { type: CompromisoInput },
  },
  outputFields: {
    compromiso: {
      type: CompromisoType,
      resolve: () => CompromisoType,
    }
  },
  mutateAndGetPayload: ({cliente,detalles,compromiso}) => {
    let { cedula, nombre, telefono } = cliente;
    let { tipo } = compromiso;
    models.cliente.findOne({where: {cedula}}).then((objeto) => {
      let promiseCli = new Promise((resolve,reject) => {
        if (objeto) {
          resolve(objeto.update({nombre,telefono}));
        } else {
          resolve(models.cliente.create({cedula,nombre,telefono}));
        }
      }).then((resultado) => {
        let total = 0;
        new Promise((resolve,reject) => {
          detalles.map(objeto => {
            total += (objeto.cantidad * objeto.unidadPrecio);
            return objeto;
          });
          resolve(total);
        }).then((total) => {
          models.compromiso.create({
            total,
            tipo,
            clienteCedula: cedula,
          }).then((objeto) => {
            let { codigo } = objeto.dataValues;
            detalles.map(objeto => {
              models.detalle.create({
                cantidad: objeto.cantidad,
                unidadPrecio: objeto.unidadPrecio,
                totalPrecio: (objeto.cantidad * objeto.unidadPrecio),
                articuloId: objeto.articuloId,
                compromisoCodigo: codigo,
              }).then(() => {
                models.articulo.findOne({
                  where: {id: 
                    {$eq: objeto.articuloId}
                  }
                }).then((articulo) => {
                  let { stock } = articulo.dataValues;
                  stock -= objeto.cantidad;
                  articulo.update({stock});
                });
              });
            });
            if (tipo === "venta") {
              models.pago.create({
                pago: total,
                compromisoCodigo: codigo,
              })
            }
          });
        });
      });
    });
    return cliente;
  },
});

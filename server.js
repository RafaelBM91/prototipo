import Express from 'express';
import graphQLHTTP from 'express-graphql';

import {Schema} from './data/schema';
import {WDServer} from './scripts/webpack';

const graphQLServer = Express();
graphQLServer.use('/', graphQLHTTP({ schema: Schema, graphiql: true }));
graphQLServer.listen (8080,() => {
  console.log('Graphql corre.!');
});

WDServer.use("/", Express.static("public"));
WDServer.listen(3000,() => {
  console.log('Webpack-Dev-Server corre.!');
});

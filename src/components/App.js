import React, { Component } from 'react';
import Relay from 'react-relay';

import { CompromisoRoute, MovimientoRoute } from '../routes/AppRoute.js';
import compromiso from './compromiso';
import movimiento from './movimientos';

export class App extends Component {
  render() {
    return (
      <div>
        <Relay.RootContainer
          Component={compromiso}
          route={new CompromisoRoute()}
          renderLoading={function() {
            return <div>Loading...</div>;
          }}
        />
        <Relay.RootContainer
          Component={movimiento}
          route={new MovimientoRoute()}
          renderLoading={function() {
            return <div>Loading...</div>;
          }}
        />
      </div>
    );
  }
}

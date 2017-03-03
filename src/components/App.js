import React, { Component } from 'react';
import Relay from 'react-relay';

import { CompromisoRoute } from '../routes/AppRoute.js';
import compromiso from './compromiso';

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
      </div>
    );
  }
}

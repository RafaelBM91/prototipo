import Relay from 'react-relay';

export class CompromisoRoute extends Relay.Route {
  static routeName = 'CompromisoRoute';
  static queries = {
    compromiso: (Component) => {
      return Relay.QL`
      query {
        compromiso {
          ${Component.getFragment('compromiso')}
        }
      }
    `},
  };
}

export class MovimientoRoute extends Relay.Route {
  static routeName = 'MovimientoRoute';
  static queries = {
    movimientos: (Component) => {
      return Relay.QL`
      query {
        movimientos {
          ${Component.getFragment('movimientos')}
        }
      }
    `},
  };
}

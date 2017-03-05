import React, { Component } from 'react';
import Relay from 'react-relay';
import {Table, Column, Cell} from 'fixed-data-table';

class CompromisoMutation extends Relay.Mutation {
  static fragments = {
    compromiso: () => Relay.QL`
      fragment on CompromisoType { codigo }
    `,
  };
  getMutation() {   
    return Relay.QL`
      mutation{ CompromisoMutation }
    `;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CompromisoMutationPayload { 
        compromiso {
          codigo
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { compromiso: this.props.compromiso.codigo },
    }];
  }
  getVariables() {
    let { cliente, detalles, tipo } = this.props;
    let compromiso = { tipo };
    console.log(
      compromiso
    );
    return {
      cliente,
      detalles,
      compromiso,
    };
  }
}

class Cliente extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._handleBuscar = this._handleBuscar.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    let { cliente } = this.props.cliente;
    if (cliente.length && !(this.refs.cedula.readOnly)) {
      this.props._cargaCliente(cliente[0]);
      this.refs.cedula.readOnly = true;
    }
  }
  _handleBuscar(e) {
    let cedula = (this.refs.cedula.value) ? this.refs.cedula.value : '';
    if (e.keyCode === 13 && cedula.length > 0) {
      this.props.relay.setVariables({ cedula });
    }
  }
  render() {
    let { cedula, nombre, telefono } = this.props.StateCliente;
    return (
      <div>
        <h1>Cliente</h1>
        <input placeholder="Cedula" type="text" name="cedula" ref="cedula" autoComplete="off"
          value={cedula}
          onChange={this.props._handleCliente}
          onKeyUp={this._handleBuscar} />
        <br/><br/>
        <input placeholder="Nombre" type="text" name="nombre"
          value={nombre}
          onChange={this.props._handleCliente} />
        <br/><br/>
        <input placeholder="Telefono" type="text" name="telefono"
          value={telefono}
          onChange={this.props._handleCliente} />
        <br/><br/>
        <input type="button" value="Guardar" onClick={this.props._handlerGuardar} />
      </div>
    );
  }
}

Cliente = Relay.createContainer(Cliente, {
  initialVariables: {
    cedula: '',
  },
  fragments: {
    cliente: () => Relay.QL`
      fragment on ClienteType {
        cliente (cedula:$cedula) {
          nombre,
          telefono,
        },
      }
    `,
  },
});

class Articulos extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { articulos } = this.props.articulos;
    return (
      <div>
        <h1>Articulos</h1>
        <Table
          rowHeight={30}
          rowsCount={articulos.length}
          width={666}
          height={345}
          headerHeight={30} >
          <Column
            header={<Cell>Descripcion</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {articulos[rowIndex].descripcion}
              </Cell>
            )}
            width={250} />
          <Column
            header={<Cell>Precio</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {
                  articulos[rowIndex].precio
                } Bs
              </Cell>
            )}
            width={150} />
          <Column
            header={<Cell>Cantidad</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {articulos[rowIndex].stock}
              </Cell>
            )}
            width={100} />
          <Column
            header={<Cell>Seleccionar</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                &nbsp;&nbsp;&nbsp;
                <button
                  name="add"
                  type="button"
                  className="fa fa-arrow-up"
                  value={JSON.stringify(articulos[rowIndex])}
                  onClick={this.props._handleSelectArticulo} >
                </button>
                  &nbsp;&nbsp;&nbsp;
                <button
                  name="sub"
                  type="button"
                  className="fa fa-arrow-down"
                  value={JSON.stringify(articulos[rowIndex])}
                  onClick={this.props._handleSelectArticulo} >
                </button>
              </Cell>
            )}
            width={116} />
        </Table>
      </div>
    );
  }
}

Articulos = Relay.createContainer(Articulos, {
  initialVariables: {
    descripcion: '',
  },
  fragments: {
    articulos: () => Relay.QL`
      fragment on ArticuloType {
        articulos (descripcion:$descripcion) {
          id
          descripcion
          stock
          precio
        },
      }
    `,
  },
});

class Lista extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { SeleccionArticulos } = this.props;
    return(
      <div>
        <h1>Lista</h1>
        <Table
          rowHeight={30}
          rowsCount={SeleccionArticulos.length}
          width={666}
          height={340}
          headerHeight={30} >
          <Column
            header={<Cell>Descripcion</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {
                  SeleccionArticulos[rowIndex].descripcion
                }
              </Cell>
            )}
            width={250} />
          <Column
            header={<Cell>Cantidad</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {
                  SeleccionArticulos[rowIndex].cantidad
                }
              </Cell>
            )}
            width={100} />
          <Column
            header={<Cell>Precio c/u</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {
                  SeleccionArticulos[rowIndex].precio
                }
              </Cell>
            )}
            width={150} />
          <Column
            header={<Cell>Sub Total</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {
                  (SeleccionArticulos[rowIndex].cantidad
                  *
                  SeleccionArticulos[rowIndex].precio)
                }
              </Cell>
            )}
            width={150} />
        </Table>
      </div>
    );
  }
}

class Compromiso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cliente: {
        cedula: '19529584',
        nombre: '',
        telefono: '',
      },
      SeleccionArticulos: [],
      total: 0,
      tipo: 'venta',
    };
    this._handleCliente = this._handleCliente.bind(this);
    this._cargaCliente = this._cargaCliente.bind(this);
    this._handlerGuardar = this._handlerGuardar.bind(this);
    this._handleSelectArticulo = this._handleSelectArticulo.bind(this);
    this._handleFactura = this._handleFactura.bind(this);
  }
  _handleCliente(e) {
    let { name, value} = e.target;
    let { cliente } = this.state;
    cliente[name] = value;
    this.setState({ cliente });
  }
  _cargaCliente(carga) {
    let { cliente } = this.state;
    cliente.nombre = carga.nombre;
    cliente.telefono = carga.telefono;
    this.setState({ cliente });
  }
  _handleSelectArticulo(e) {
    let { name, value } = e.target;
    let { SeleccionArticulos } = this.state;
    let objeto = JSON.parse(value);
    let index = this.buscarArticuloID(objeto,SeleccionArticulos);
    switch (name) {
      case 'add':
        if (index === -1) {
          let { id, descripcion, precio, stock } = objeto;
          if (stock > 0)
            SeleccionArticulos.push(
              {
                id,
                descripcion,
                precio,
                stock,
                cantidad: 1,
              }
            );
        } else {
          let { stock, cantidad } = SeleccionArticulos[index];
          if (stock > cantidad) {
            SeleccionArticulos[index].cantidad++;
          } else {
            // mensaje de error sobre paso el stock
          }
        }
      break;
      case 'sub':
        if (index > -1) {
          let { cantidad } = SeleccionArticulos[index];
          if (cantidad === 1) {
            SeleccionArticulos.splice(index,1);
          } else {
            SeleccionArticulos[index].cantidad--;
          }
        }
      break;
    }
    this._imprimeTotal();
    this.setState({ SeleccionArticulos });
  }
  buscarArticuloID(objeto,SeleccionArticulos) {
    let i = -1;
    SeleccionArticulos.map((elemento,index) => {
      if(elemento.id === objeto.id)
        i = index;
      return elemento;
    });
    return i;
  }
  _handlerGuardar(e) {
    let detalles = this._preSendDetalles();
    let { cliente, tipo } = this.state;
    let operacion = Relay.Store.applyUpdate(
      new CompromisoMutation({
        compromiso: this.props.compromiso,
        cliente: cliente,
        detalles,
        tipo,
      })
    );
    operacion.commit();
  }
  _preSendDetalles() {
    let { SeleccionArticulos } = this.state;
    let newSeleccionArticulos = [];
    newSeleccionArticulos = SeleccionArticulos.map(objeto => {
      return {
        cantidad: objeto.cantidad,
        unidadPrecio: objeto.precio,
        articuloId: parseInt(objeto.id,10),
      }
    });
    return newSeleccionArticulos;
  }
  _handleFactura(e) {
    let tipo = e.target.value;
    this.setState({ tipo });
    console.log(
      tipo
    );
  }
  _imprimeTotal() {
    let { total, SeleccionArticulos } = this.state;
    total = 0;
    SeleccionArticulos.map(objeto => {
      total += (objeto.cantidad * objeto.precio);
      return objeto;
    });
    this.setState({ total });
  }
  render() {
    return (
      <div>
        <Cliente cliente={this.props.compromiso.cliente}
        StateCliente={this.state.cliente}
        _handleCliente={this._handleCliente}
        _cargaCliente={this._cargaCliente}
        _handlerGuardar={this._handlerGuardar} />
        <br/><br/>
        <fieldset>
          <legend>Factura</legend>
          Venta: <input type="radio" name="operacion" value="venta"
          defaultChecked={true}
          onChange={this._handleFactura} />
          &nbsp;&nbsp;
          pedido: <input type="radio" name="operacion" value="pedido"
          onChange={this._handleFactura} />
        </fieldset>
        <Articulos articulos={this.props.compromiso.articulos}
          _handleSelectArticulo={this._handleSelectArticulo} />
        <h1>Total:&nbsp;&nbsp;<em>{this.state.total}</em></h1>
        <Lista SeleccionArticulos={this.state.SeleccionArticulos} />
      </div>
    );
  }
}

export default Compromiso = Relay.createContainer(Compromiso, {
  fragments: {
    compromiso: () => Relay.QL`
      fragment on CompromisoType {
        cliente {
          ${Cliente.getFragment('cliente')}
        }
        articulos {
          ${Articulos.getFragment('articulos')}
        }
        ${CompromisoMutation.getFragment('compromiso')}
      }
    `,
  },
});

import React, { Component } from 'react';
import Relay from 'react-relay';
import {Table, Column, Cell} from 'fixed-data-table';
import numeral from 'numeral';
import moment from 'moment';
import DatePicker from 'react-datepicker';

class Movimientos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detalles: [],
      startDate: moment(),
      endDate: moment(),
      ingresos: 0.00,
    };
    this._handleShowDetalles = this._handleShowDetalles.bind(this);
    this._handleStartDate = this._handleStartDate.bind(this);
    this._handleEndDate = this._handleEndDate.bind(this);
  }
  _handleShowDetalles(e) {
    let { value } = e.target;
    let { detalles } = this.props.movimientos.pagos[parseInt(value)].compromiso;
    this.setState({ detalles });
  }
  _handleStartDate(e) {
    let startDate = moment(e);
    this.setState({ startDate });
    this.props.relay.setVariables({
      desde: this.Datef(moment(startDate)),
    })
  }
  _handleEndDate(e) {
    let endDate = moment(e);
    this.setState({ endDate });
    this.props.relay.setVariables({
      hasta: this.Datef(moment(endDate).add(1,"days")),
    })
  }
  Datef(date) {
    this.setState({ detalles: [] });
    return date.format('YYYY-MM-DD')+'T00:00:00.000Z';
  }
  render() {
    let { pagos } = this.props.movimientos;
    let { detalles, startDate, endDate, ingresos } = this.state;
    pagos.map(objeto => {
      ingresos += objeto.compromiso.anulado ? 0 : objeto.pago;
      return objeto;
    });
    return (
      <div>
        <h1>LISTA DE MOVIMIENTOS</h1>
        <DatePicker
          selected={startDate}
          dateFormat="DD-MM-YYYY"
          onChange={this._handleStartDate} />
        &nbsp;&nbsp;
        <DatePicker
          selected={endDate}
          dateFormat="DD-MM-YYYY"
          minDate={startDate}
          onChange={this._handleEndDate} />
        <br/><br/>
        <h1>Total Ingresos: {numeral(ingresos).format('0,0.00')} Bs</h1>
        <Table
          rowHeight={70}
          rowsCount={pagos.length}
          width={666}
          height={340}
          headerHeight={30} >
          <Column
            header={<Cell>Descripcion</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell
                style={
                  {
                    backgroundColor: pagos[rowIndex].compromiso.anulado ? '#FD004f' : ''
                  }
                }
                {...props} >
                {
                  pagos[rowIndex].compromiso.tipo
                  +' - '+
                  moment(pagos[rowIndex].compromiso.createdAt).format('DD-MM-YYYY')
                }
                <br/>
                C.I. {pagos[rowIndex].compromiso.cliente.cedula}
                <br/>
                {pagos[rowIndex].compromiso.cliente.nombre}
              </Cell>
            )}
            width={260} />
          <Column
            header={<Cell>Total/Operación</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell
                style={
                  {
                    backgroundColor: pagos[rowIndex].compromiso.anulado ? '#FD004f' : ''
                  }
                }
                {...props} >
                {
                  numeral(pagos[rowIndex].compromiso.total).format('0,0.00')
                }&nbsp;Bs
                <br/>
                Resta:&nbsp;{
                  numeral(
                    pagos[rowIndex].compromiso.total - pagos[rowIndex].pago
                  ).format('0,0.00')
                }&nbsp;Bs
              </Cell>
            )}
            width={155} />
          <Column
            header={<Cell>Pago Realizado</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell
                style={
                  {
                    backgroundColor: pagos[rowIndex].compromiso.anulado ? '#FD004f' : ''
                  }
                }
                {...props} >
                {
                  moment(pagos[rowIndex].createdAt
                    .substr(0,10),"YYYY-MM-DD")
                      .format('DD-MM-YYYY')
                }
                <br/>
                {
                  numeral(pagos[rowIndex].pago).format('0,0.00')
                }&nbsp;Bs
              </Cell>
            )}
            width={135} />
          <Column
            header={<Cell>Operación</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell
                style={
                  {
                    backgroundColor: pagos[rowIndex].compromiso.anulado ? '#FD004f' : ''
                  }
                }
                {...props} >
                <button type="button"
                  ref={rowIndex}
                  value={rowIndex}
                  onClick={this._handleShowDetalles} >Ver Detalles</button>
              </Cell>
            )}
            width={115} />
        </Table>
        <br/><br/>
        <Table
          rowHeight={30}
          rowsCount={detalles.length}
          width={666}
          height={340}
          headerHeight={30} >
          <Column
            header={<Cell>Descripcion</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {detalles[rowIndex].articulo.descripcion}
              </Cell>
            )}
            width={260} />
          <Column
            header={<Cell>Cantidad</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {detalles[rowIndex].cantidad}
              </Cell>
            )}
            width={135} />
          <Column
            header={<Cell>Precio c/u</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {
                  numeral(detalles[rowIndex].unidadPrecio).format('0,0.00')
                }&nbsp;Bs
              </Cell>
            )}
            width={135} />
          <Column
            header={<Cell>SubTotal</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>
                {
                  numeral(detalles[rowIndex].totalPrecio).format('0,0.00')
                }&nbsp;Bs
              </Cell>
            )}
            width={135} />
        </Table>
      </div>
    );
  }
}

export default Movimientos = Relay.createContainer(Movimientos, {
  initialVariables: {
    desde: moment().format('YYYY-MM-DD')+'T00:00:00.000Z',
    hasta: moment().add(1,"days").format('YYYY-MM-DD')+'T00:00:00.000Z',
  },
  fragments: {
    movimientos: () => Relay.QL`
      fragment on PagoType {
        pagos (
          desde:$desde
          hasta:$hasta
        ) {
          createdAt
          pago
          compromiso {
            anulado
            tipo
            total
            createdAt
            cliente {
              nombre
              cedula
            }
            detalles {
              cantidad
              articulo { descripcion }
              unidadPrecio
              totalPrecio
            }
          }
        }
      }
    `,
  },
});

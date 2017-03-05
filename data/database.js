import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  'prueba',
  'dev',
  'sistema',
  {
    dialect: 'mysql',
  }
);

const Cliente = sequelize.define('cliente',{
  cedula: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  telefono: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

const Articulo = sequelize.define('articulo',{
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  precio: {
    type: Sequelize.FLOAT(8,2),
    allowNull: false,
  },
  stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Compromiso = sequelize.define('compromiso',{
  codigo: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    allowNull: false,
    unique: true,
  },
  total: {
    type: Sequelize.FLOAT(8,2),
    allowNull: false,
  },
  tipo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  anulado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

Cliente.hasMany(Compromiso,{as:'clienteCedula'});

const Detalle = sequelize.define('detalle',{
  codigo: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    allowNull: false,
    unique: true,
  },
  cantidad: {
    type: Sequelize.FLOAT(8,2),
    allowNull: false,
  },
  cantidad: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  unidadPrecio: {
    type: Sequelize.FLOAT(8,2),
    allowNull: false,
  },
  totalPrecio: {
    type: Sequelize.FLOAT(8,2),
    allowNull: false,
  },
});

Articulo.hasMany(Detalle,{as:'articuloId'});
Compromiso.hasMany(Detalle,{as:'CompromisoCodigo'});

const Pago = sequelize.define('pago',{
  codigo: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    allowNull: false,
    unique: true,
  },
  pago: {
    type: Sequelize.FLOAT(8,2),
    allowNull: false,
  },
});

Compromiso.hasMany(Pago,{as:'CompromisoCodigo'});

sequelize.sync();

export default sequelize.models;
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
    type: Sequelize.FLOAT,
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

Cliente.hasMany(Compromiso);

// Articulo.hasMany(Detalle);

sequelize.sync();

export default sequelize.models;
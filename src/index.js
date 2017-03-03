import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import {App} from './components/App';

import 'fixed-data-table/dist/fixed-data-table.css';
import 'font-awesome/css/font-awesome(1).css';

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

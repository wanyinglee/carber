import React from 'react';

import BasisDataTableContainer from './containers/BasisDataTableContainer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BasisDataTableContainer />
    </div>
  );
}

export default App;

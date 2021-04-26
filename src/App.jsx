import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css';

const gridOptions = {
  columnsDefs: [
    {
      headerName: 'Symbol',
      field: 'symbol',
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Pair',
      field: 'pair',
      sort: 'asc',
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains', 'startsWith'],
        defaultOption: 'startsWith',
        newRowsAction: 'keep',
      },
    },
    {
      headerName: 'Price',
      field: 'price',
    },
    {
      headerName: 'Spot Price',
      field: 'spotPrice',
    },
    {
      headerName: 'Basis',
      field: 'basis',
      valueFormatter: param => `${(Number(param.value) * 100).toFixed(4)}%`,
    },
    {
      headerName: 'Annualized Basis',
      field: 'annualizedBasis',
      valueFormatter: param => `${(Number(param.value) * 100).toFixed(1)}%`,
    }
  ],
  defaultColGroupDef: {
    editable: false,
    resizable: true,
    sortable: true,
  }
}

const App = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [exchangeInfo, setExchangeInfo] = useState([]);
  const [rowData, setRowData] = useState([]);

  const getPremiumIndex = () => {
    return axios.get('https://dapi.binance.com/dapi/v1/premiumIndex');
  }
  const getExchangeInfo = () => {
    return axios.get('https://dapi.binance.com/dapi/v1/exchangeInfo');
  }

  const getBasisRate = (indexInfo) => {
    if (indexInfo.symbol.indexOf('_PERP') > -1) {
      return Number(indexInfo.lastFundingRate);
    } else {
      return Number(indexInfo.markPrice) / Number(indexInfo.indexPrice) - 1;
    }
  };

  const getAnnualizedBasis = (indexInfo, exchangeInfo) => {
    const rate = getBasisRate(indexInfo);
    if (indexInfo.symbol.indexOf('_PERP') > -1) {
      return Math.pow(1 + Number(indexInfo.lastFundingRate), 365 * 3) - 1;
    } else {
      const expiryDate = exchangeInfo.filter(info => info.symbol === indexInfo.symbol)[0].deliveryDate;
      const currentDate = indexInfo.time;
      const ratio = 365 * 24 * 3600 * 1000 / (expiryDate - currentDate);
      return Math.pow(1 + Number(rate), ratio) - 1;
    }
  }

  useEffect(() => {
    getExchangeInfo().then(response => {
      const result = response.data.symbols;
      setExchangeInfo(result);
    });

    const interval = setInterval(() => {
      getExchangeInfo().then(response => {
        const result = response.data.symbols;
        setExchangeInfo(result);
      });
    }, 3600 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (exchangeInfo && exchangeInfo.length) {
      getPremiumIndex().then(response => {
        const basisData = response.data.map(r => ({ symbol: r.symbol, pair: r.pair, price: r.markPrice, spotPrice: r.indexPrice, basis: getBasisRate(r), annualizedBasis: getAnnualizedBasis(r, exchangeInfo) }));
        setRowData(basisData);
      });

      const interval = setInterval(() => {
        getPremiumIndex().then(response => {
          const basisData = response.data.map(r => ({ symbol: r.symbol, pair: r.pair, price: r.markPrice, spotPrice: r.indexPrice, basis: getBasisRate(r), annualizedBasis: getAnnualizedBasis(r, exchangeInfo) }));
          setRowData(basisData);
        });
      }, 30 * 1000);

      return () => clearInterval(interval);
    }
  }, [exchangeInfo]);

  const onGridReady = params => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onFirstDataRendered = params => {
    gridApi.sizeColumnsToFit();
  };

  return (
    <div className="App">
      <div className="ag-theme-alpine" style={{ height: '100vh' }}>
        <AgGridReact onGridReady={onGridReady} rowData={rowData} columnDefs={gridOptions.columnsDefs} defaultColDef={gridOptions.defaultColGroupDef} onFirstDataRendered={onFirstDataRendered} />
      </div>
    </div>
  );
}

export default App;

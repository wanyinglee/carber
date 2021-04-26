import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

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
};

const BasisDataTable = ({ data }) => {
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = params => {
    setGridApi(params.api);
  };

  const onFirstDataRendered = params => {
    gridApi.sizeColumnsToFit();
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '100vh' }}>
      <AgGridReact onGridReady={onGridReady} rowData={data} columnDefs={gridOptions.columnsDefs} defaultColDef={gridOptions.defaultColGroupDef} onFirstDataRendered={onFirstDataRendered} />
    </div>
  );
};

export default BasisDataTable;

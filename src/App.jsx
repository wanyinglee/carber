import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Table } from 'antd';
import 'antd/dist/antd.css';

const bybitSymbolMapping = {
  BTCUSD: 'PERPETUAL',
  BTCUSDM21: 'CURRENT_QUARTER',
  BTCUSDU21: 'NEXT_QUARTER',
};

const columns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record, index) => Number(text).toFixed(1),
  },
  {
    title: 'Spot Price',
    dataIndex: 'spotPrice',
    key: 'spotPrice',
    render: (text, record, index) => Number(text).toFixed(1),
  },
  {
    title: 'Basis',
    dataIndex: 'basis',
    key: 'basis',
    render: (text, record, index) => `${(text * 100).toFixed(1)}%`,
  },
];

const App = () => {
  const [data, setData] = useState([]);
  const [bybitData, setBybitData] = useState([]);
  // Binance
  const getPerpetualBasis = () => {
    return axios.get('https://dapi.binance.com/futures/data/basis?pair=BTCUSD&contractType=PERPETUAL&period=5m&limit=1');
  };
  const getCurrentQuarterBasis = () => {
    return axios.get('https://dapi.binance.com/futures/data/basis?pair=BTCUSD&contractType=CURRENT_QUARTER&period=5m&limit=1');
  }
  const getNextQuarterBasis = () => {
    return axios.get('https://dapi.binance.com/futures/data/basis?pair=BTCUSD&contractType=NEXT_QUARTER&period=5m&limit=1');
  }
  // Bybit
  const getByBitBasis = () => {
    return axios.get('https://api.bybit.com/v2/public/tickers', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': '*/*',
        'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, PATCH, OPTIONS',
      }
    });
  }
  const getByBitRate = (record) => {
    switch (record.symbol) {
      case 'BTCUSD':
        return record.predicted_funding_rate;
      case 'BTCUSDM21':
      case 'BTCUSDU21':
        return record.mark_price / record.index_price - 1;
    }
  }

  const getBasisRate = (type, rate) => {
    const now = new Date();
    const curExpiryDate = new Date(2021, 5, 25, 16);
    const curRatio = (365 * 24 * 3600 / ((curExpiryDate - now) / 1000));
    const nextExpiryDate = new Date(2021, 8, 24, 16);
    const nextRatio = (365 * 24 * 3600 / ((nextExpiryDate - now) / 1000));

    switch (type) {
      case 'PERPETUAL':
        return Math.pow(1 + Number(rate), 365 * 3) - 1;
      case 'CURRENT_QUARTER':
        return Math.pow(1 + Number(rate), curRatio) - 1;
      case 'NEXT_QUARTER':
        return Math.pow(1 + Number(rate), nextRatio) - 1;
      default:
        return 0;
    }
  }

  useEffect(() => {
    Promise.all([getPerpetualBasis(), getCurrentQuarterBasis(), getNextQuarterBasis()]).then(response => {
      const result = [...response[0].data, ...response[1].data, ...response[2].data];
      setData(result.map(r => ({ symbol: r.contractType, price: r.futuresPrice, spotPrice: r.indexPrice, basis: getBasisRate(r.contractType, r.basisRate)})));
    });
    // getByBitBasis().then(response => {
    //   const btcResult = response.result.filter(r => r.symbol.startWith('BTCUSD'));
    //   const bybitData = btcResult.map(r => ({ symbol: bybitSymbolMapping(r.symbol), price: r.mark_price, spotPrice: r.index_price, basis: getBasisRate(bybitSymbolMapping(r.symbol), getByBitRate(r)) }));
    //   setBybitData(bybitData);
    // });

    const interval = setInterval(() => {
      Promise.all([getPerpetualBasis(), getCurrentQuarterBasis(), getNextQuarterBasis()]).then(response => {
        const result = [...response[0].data, ...response[1].data, ...response[2].data];
        setData(result.map(r => ({ symbol: r.contractType, price: r.futuresPrice, spotPrice: r.indexPrice, basis: getBasisRate(r.contractType, r.basisRate) })));
      });
      // getByBitBasis().then(response => {
      //   const btcResult = response.result.filter(r => r.symbol.startWith('BTCUSD'));
      //   const bybitData = btcResult.map(r => ({ symbol: bybitSymbolMapping(r.symbol), price: r.mark_price, spotPrice: r.index_price, basis: getBasisRate(bybitSymbolMapping(r.symbol), getByBitRate(r)) }));
      //   setBybitData(bybitData);
      // });
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {data.length && <Table dataSource={data} columns={columns} />}
      {/* {bybitData.length && <Table dataSource={bybitData} columns={columns} />} */}
    </div>
  );
}

export default App;

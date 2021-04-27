import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import BasisDataTable from '../../components/BasisDataTable';

const BasisDataTableContainer = () => {
  const [exchangeInfo, setExchangeInfo] = useState([]);
  const [premiumIndex, setPremiumIndex] = useState([]);

  const getPremiumIndex = () => {
    return axios.get('https://dapi.binance.com/dapi/v1/premiumIndex');
  }
  const getExchangeInfo = () => {
    return axios.get('https://dapi.binance.com/dapi/v1/exchangeInfo');
  }

  const getBasisRate = useCallback((indexInfo) => {
    if (indexInfo.symbol.indexOf('_PERP') > -1) {
      return Number(indexInfo.lastFundingRate);
    } else {
      return Number(indexInfo.markPrice) / Number(indexInfo.indexPrice) - 1;
    }
  }, []);

  const getAnnualizedBasis = useCallback((indexInfo, exchangeInfo) => {
    const rate = getBasisRate(indexInfo);
    if (indexInfo.symbol.indexOf('_PERP') > -1) {
      //return Math.pow(1 + Number(indexInfo.lastFundingRate), 365 * 3) - 1;
      return Number(indexInfo.lastFundingRate) * 365 * 3;
    } else {
      const expiryDate = exchangeInfo.filter(info => info.symbol === indexInfo.symbol)[0].deliveryDate;
      const currentDate = indexInfo.time;
      const ratio = 365 * 24 * 3600 * 1000 / (expiryDate - currentDate);
      //return Math.pow(1 + Number(rate), ratio) - 1;
      return Number(rate) * ratio;
    }
  }, [getBasisRate]);

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
        setPremiumIndex(basisData);
      });

      const interval = setInterval(() => {
        getPremiumIndex().then(response => {
          const basisData = response.data.map(r => ({ symbol: r.symbol, pair: r.pair, price: r.markPrice, spotPrice: r.indexPrice, basis: getBasisRate(r), annualizedBasis: getAnnualizedBasis(r, exchangeInfo) }));
          setPremiumIndex(basisData);
        });
      }, 30 * 1000);

      return () => clearInterval(interval);
    }
  }, [exchangeInfo, getAnnualizedBasis, getBasisRate]);

  return <BasisDataTable data={premiumIndex} />
};

export default BasisDataTableContainer;

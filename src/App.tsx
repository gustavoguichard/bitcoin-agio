import React, { useState } from 'react'
import { formatMoney } from './numeral'
import mapValues from 'lodash/mapValues'
import { useInterval, useOnMount } from './hooks'
import { fetchCoinValue, getAgio } from './utils'
import logo from './bitcoin.png'
import './App.css'

const COINDESK_API = 'https://api.coindesk.com/v1/bpi/currentprice/BRL.json'
const MERCADO_API = 'https://www.mercadobitcoin.net/api/BTC/ticker/'
const BITCOIN_API = 'https://api.bitcointrade.com.br/v2/public/BRLBTC/ticker'
const CURRENT_YEAR = new Date().getFullYear()

const App = () => {
  const [coindesk, setCoindesk] = useState(0)
  const [coindeskBR, setCoindeskBr] = useState(0)
  const [bitcoinTrade, setBitcoinTrade] = useState(0)
  const [mercado, setMercado] = useState(0)

  useOnMount(updatePrices)
  useInterval(updatePrices, 30000)

  const dollar = coindeskBR / coindesk
  const output = { coindesk, coindeskBR, mercado, bitcoinTrade, dollar }
  const prices = mapValues(output, formatMoney)

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="logo">
          <img src={logo} alt="Bitcoin Logo" />
          Bitcoin Agio
        </h1>
        <h1 className="App-title">
          MercadoBitcoin: R$ {prices.mercado} - {getAgio(mercado, coindeskBR)}%
        </h1>
        <h1 className="App-title">
          BitcoinTrade: R$ {prices.bitcoinTrade} -{' '}
          {getAgio(bitcoinTrade, coindeskBR)}%
        </h1>
      </header>
      <p className="App-intro">
        Coindesk: U$ {prices.coindesk} (R$ {prices.coindeskBR})
      </p>
      <p className="App-intro">Dollar: R$ {prices.dollar}</p>

      <p>&copy; {CURRENT_YEAR} - Gustavo Guichard</p>
    </div>
  )

  function updatePrices() {
    fetchCoinValue(COINDESK_API, 'bpi.BRL.rate_float', setCoindeskBr)
    fetchCoinValue(COINDESK_API, 'bpi.USD.rate_float', setCoindesk)
    fetchCoinValue(MERCADO_API, 'ticker.last', setMercado)
    fetchCoinValue(BITCOIN_API, 'data.last', setBitcoinTrade)
  }
}

export default App

import React, { Component } from 'react';
import numeral from 'numeral';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

numeral.register('locale', 'pt-BR', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
});
numeral.locale('pt-BR');

class App extends Component {
  state = {
    coindesk: 0,
    coindeskBR: 0,
    mercado: 0,
  }

  componentWillMount() {
    this.updatePrices()
  }

  componentDidMount() {
    this.interval = setInterval(this.updatePrices.bind(this), 30000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    this.interval = null
  }

  updatePrices() {
    this.fetchCoindesk()
    this.fetchMercado()
  }

  fetchCoindesk() {
    axios.get('https://api.coindesk.com/v1/bpi/currentprice/BRL.json')
      .then(({ data }) => {
        const { BRL, USD } = data.bpi
        if(BRL && USD) {
          this.setState({ coindesk: USD.rate_float, coindeskBR: BRL.rate_float })
        }
      })
  }

  fetchMercado() {
    axios.get('https://www.mercadobitcoin.net/api/BTC/ticker/')
      .then(({ data }) => {
        const { last } = data.ticker
        if(last) {
          const mercado = parseFloat(last)
          this.setState({ mercado })
        }
      })
  }

  get dollar() {
    return this.state.coindeskBR / this.state.coindesk
  }

  get prices() {
    const format = '0,0.00'
    return {
      coindesk: numeral(this.state.coindesk).format(format),
      mercado: numeral(this.state.mercado).format(format),
      dollar: numeral(this.dollar).format(format),
    }
  }

  get agio() {
    const total = ((this.state.mercado * 100) / this.state.coindeskBR) - 100
    return numeral(total).format('0.0')
  }

  render() {
    const year = new Date().getFullYear()
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bitcoin Ágio: {this.agio}%</h1>
        </header>
        <p className="App-intro">
          MercadoBitcoin: R$ {this.prices.mercado}
        </p>
        <p className="App-intro">
          Coindesk: U$ {this.prices.coindesk}
        </p>
        <p className="App-intro">
          Dollar: R$ {this.prices.dollar}
        </p>

        <p>
          &copy; {year} - Gustavo Guichard
        </p>
      </div>
    );
  }
}

export default App;

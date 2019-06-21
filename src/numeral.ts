import numeral from 'numeral'

numeral.register('locale', 'pt-BR', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'mil',
    million: 'milhão',
    billion: 'bilhão',
    trillion: 'trilhão',
  },
  ordinal: (number: any) => number,
  currency: {
    symbol: 'R$',
  },
})
numeral.locale('pt-BR')

export const formatMoney = (value: number): string => {
  return numeral(value).format('0,0.00')
}

export default numeral

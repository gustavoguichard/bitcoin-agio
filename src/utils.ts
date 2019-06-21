import axios, { AxiosResponse } from 'axios'
import numeral from './numeral'
import get from 'lodash/get'

export const fetchCoinValue = async (
  api: string,
  path: string,
  callback: (t: number) => void,
): Promise<void> => {
  const response: AxiosResponse = await axios.get(api)
  const value: string = get(response.data, path)
  if (value) {
    callback(parseFloat(value))
  }
}

export const getAgio = (price: number, basePrice: number) => {
  const total = (price * 100) / basePrice - 100
  return numeral(total).format('0.0')
}

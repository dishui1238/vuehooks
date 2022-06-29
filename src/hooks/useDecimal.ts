import { Decimal } from 'decimal.js'

export const decimal = {
  add: (a: number, b: number) => Decimal.add(a || 0, b || 0).toNumber(), // 加法
  mul: (a: number, b: number) => Decimal.mul(a || 0, b || 0).toNumber(), // 乘法
  sub: (a: number, b: number) => Decimal.sub(a || 0, b || 0).toNumber(), // 减法
  div: (a: number, b: number) => Decimal.div(a || 0, b || 0).toNumber(), // 除法
}

export const getNumberToFixed = (value: number | string, digit?: number) => {
  if (value === 0) {
    return value
  } if (value) {
    const defaultDigit = 2 // 默认保留小数点后两位
    const targetDigit = digit !== undefined ? digit : defaultDigit
    const str = `${value || 0}`
    const numbers = str.split('.')
    const decimalPart = numbers[1]
    if (numbers?.length > 1 && decimalPart) {
      const num = new Decimal(Number(value || 0))
      return Number(num.toFixed(targetDigit) || 0)
    }
    return value
  }
  return ''
}

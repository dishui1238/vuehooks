export const thousandth = (value: number | string) => {
  // eslint-disable-next-line no-restricted-globals
  if (typeof Number(value) !== 'number' || isNaN(Number(value))) {
    return 0
  }
  if (value === 0) {
    return value
  } if (value) {
    const reg = /\d{1,3}(?=(\d{3})+$)/g
    const str = `${value || 0}`
    const numbers = str.split('.')
    const integer = numbers[0]
    const decimal = numbers[1]
    return numbers?.length > 1 ? `${integer.replace(reg, '$&,')}.${decimal}` : integer.replace(reg, '$&,')
  }
  return ''
}

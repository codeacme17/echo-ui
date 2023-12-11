export const handleValueType = (value: any, type: React.HTMLInputTypeAttribute) => {
  if (type === `number`) return Number(value)
  return value
}

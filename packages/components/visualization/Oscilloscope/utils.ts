import * as d3 from 'd3'

type ScaleType = d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number> | null

/**
 *  Returns a valid scaled value for a given scale and data point.
 */
export const validScaledNaN = (scale: ScaleType, data: number) => {
  let v = scale!(data)
  if (Number.isNaN(v)) v = -100
  return v
}

// Simplified equirectangular outlines, grouped by sales region.
export const WORLD_VIEWBOX = '10 10 985 400'

export const WORLD_REGIONS = [
  {
    id: 'north-america',
    name: 'North America',
    labelAt: { x: 205, y: 120 },
    shapes: [
      'M33,67 L111,56 L153,56 L222,47 L264,47 L333,83 L347,111 L319,125 L306,133 L292,153 L275,181 L231,178 L208,194 L181,167 L153,139 L153,117 L125,89 L83,83 L42,97 Z',
      'M375,83 L444,83 L458,42 L417,17 L347,28 L339,56 Z',
      'M243,196 L268,192 L279,205 L262,208 L246,203 Z',
    ],
  },
  {
    id: 'south-america',
    name: 'South America',
    labelAt: { x: 330, y: 310 },
    shapes: [
      'M275,228 L306,217 L333,236 L356,250 L403,264 L394,292 L367,319 L339,347 L319,375 L306,403 L292,389 L297,361 L303,333 L303,300 L283,264 L281,244 Z',
    ],
  },
  {
    id: 'europe',
    name: 'Europe',
    labelAt: { x: 528, y: 105 },
    shapes: [
      'M472,150 L500,128 L508,131 L533,125 L550,139 L578,136 L583,125 L611,117 L600,86 L578,56 L542,61 L514,83 L486,89 L472,111 L494,117 L475,128 Z',
      'M478,111 L489,106 L492,119 L481,122 Z',
    ],
  },
  {
    id: 'africa',
    name: 'Africa',
    labelAt: { x: 545, y: 255 },
    shapes: [
      'M453,192 L500,181 L533,158 L569,161 L592,164 L597,189 L619,217 L642,219 L617,253 L611,292 L592,325 L569,344 L550,347 L533,267 L525,239 L494,236 L478,239 L464,222 Z',
      'M624,286 L636,292 L639,314 L628,319 L622,300 Z',
    ],
  },
  {
    id: 'asia',
    name: 'Asia',
    labelAt: { x: 810, y: 120 },
    shapes: [
      'M611,117 L639,97 L667,56 L708,42 L778,33 L861,47 L944,56 L1000,69 L994,83 L944,97 L889,125 L861,153 L839,167 L833,189 L800,222 L778,236 L764,208 L722,228 L700,194 L681,181 L667,181 L653,153 L625,139 L611,133 Z',
      'M878,131 L892,142 L897,156 L886,161 L872,147 Z',
      'M797,250 L825,247 L850,253 L861,258 L839,264 L806,258 Z',
    ],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    labelAt: { x: 875, y: 322 },
    shapes: [
      'M814,311 L861,283 L894,281 L908,306 L925,319 L917,356 L889,356 L861,339 L819,344 Z',
      'M964,347 L975,356 L983,372 L972,378 L964,361 Z',
    ],
  },
]

export const CHOROPLETH_STEPS = ['#EEF1F4', '#FFE3C2', '#FFC489', '#FF9F43', '#E8801F']

export function choroplethStep(value, max) {
  if (!value || !max) return 0
  const ratio = value / max
  if (ratio > 0.8) return 4
  if (ratio > 0.55) return 3
  if (ratio > 0.3) return 2
  return 1
}

// Public rules only. Historical prices and outcomes stay on the server.
export const RULES = Object.freeze({
  cash: 10000000, shares: 2000, reference: 1473,
  seconds: 60, revealSeconds: 15, maxPlayers: 50, roundCount: 9, orderMode: 'quantity',
  cpiStart: 244.524, cpiEnd: 308.417,
  cpiSource: 'https://www.bls.gov/regions/mid-atlantic/data/consumerpriceindexhistorical_us_table.htm',
  priceBasis: 'USD; dữ liệu giá lịch sử được khóa theo bộ dữ liệu của ván.',
  dataset: 'nflx-statmuse-20260930-v2'
});

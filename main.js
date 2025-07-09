import { getPools } from './lib/api/getPools.js'
import { getPoolInfo } from './lib/api/getPoolInfo.js'
import { printTable } from 'console-table-printer'
import { argv } from 'process'

const CHAIN = {
  ARBITRUM: { ID: 42161, NAME: "ARBITRUM" },
  UNICHAIN: { ID: 130, NAME: "UNICHAIN" },
  BASE: { ID: 8453, NAME: "BASE" },
  BNB: { ID: 56, NAME: "BNB" }
}

const SELECT_NAME = argv[2] || "ARBITRUM"

/**
 * @typedef Info
 * @type {object}
 * @property {string} link
 * @property {number} feePer1KD7Fix
 * @property {object} table
*/

const SELECT = {
  id: CHAIN[SELECT_NAME].ID,
  name: CHAIN[SELECT_NAME].NAME,

  /**
   * @param {import('./lib/api/getPools.js').Pool} p 
   * @returns {boolean} 
   */
  filter (p) {
    if (p.protocolVersion === 'V4' && p.hook.address)
      return false;
    if (p.totalLiquidity.value < 500_000)
      return false;
    if (p.protocolVersion === "V2")
      return false;
    return true
  },

  /**
   * 
   * @param {Info} a 
   * @param {Info} b 
   * @returns {number}
   */
  sort (a,b) {
    return a.feePer1KD7Fix - b.feePer1KD7Fix
  }
}

const pools = (await getPools(SELECT.id))
  .filter(SELECT.filter)

/**
 * 
 * @param {number} value 
 * @returns {string}
 */
function formatChange (value) {
  const str = value.toFixed(2)
  if (value > 0)
    return "+" + str
  return str
}

/**
 * @typedef Info
 * @type {object}
 * @property {string} link
 * @property {number} feePer1KD7Fix
 * @property {object} table
 * 
 * @param {import('./lib/api/getPools.js').Pool} p 
 * @returns {Info}
 */
async function getPoolData (p) {
  const version           = Number(p.protocolVersion.charAt(1))
  const info              = await getPoolInfo(p.id, SELECT.name, version)
  const link              = `https://app.uniswap.org/explore/pools/${p.chain}/${p.id}`.toLowerCase()
  const liq24H            = info.totalLiquidityPercentChange24h.value
  const feeTier           = p.feeTier / 10_000
  const liq               = p.totalLiquidity.value
  const volume30D         = p.volume30Day.value
  const volume7D          = p.volume1Week.value
  const volume1D          = p.volume1Day.value
  const fee30D            = volume30D / 100 * feeTier
  const fee1D             = volume1D / 100 * feeTier
  const volumeDelta       = volume7D / 7 * 30 - volume30D
  const million           = 1_000_000
  const feePer1KD30       = fee30D / liq * 1000 / 30
  const feePer1KD7        = (volume30D + volumeDelta) / volume30D * feePer1KD30
  const feePer1KDelta     = feePer1KD7 - feePer1KD30
  const feePer1KD7Fix     = feePer1KD7 * (1 + liq24H / 100)
  const feePer1KLastD     = fee1D / liq * 1000
  const apr               = feePer1KD30 * 365 / 1000 * 100
  const symbol            = `${p.token0.symbol}/${p.token1.symbol} ${feeTier}% v${version} APR ${apr.toFixed(2)}%`

  return {
    link,
    feePer1KD7Fix,
    table: {
      "Name": symbol,
      "TVL M.": (liq / million).toFixed(2),
      "Liq.24H %":  formatChange(liq24H),
      "Volume M.": (volume30D / million).toFixed(2),
      "Volume Δ": formatChange(volumeDelta / million),
      "Fee/1K D30": feePer1KD30.toFixed(2),
      "Fee/1K D7": feePer1KD7.toFixed(2),
      "Fee/1K Δ": formatChange(feePer1KDelta),
      "Fee/1K D7 Fix": feePer1KD7Fix.toFixed(2),
      "Fee/1K Last Day": feePer1KLastD.toFixed(2)
    }
  }
}

const infos = (await Promise.all(pools.map(p => getPoolData(p))))
  .sort(SELECT.sort)

for (const { link, table } of infos) {
  printTable([table])
  console.log(link)
  console.log(" ")
}
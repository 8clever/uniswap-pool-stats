/**
 * @typedef PoolValue
 * @type {object}
 * @property {number} value
 * 
 * @typedef Token
 * @type {object}
 * @property {string} symbol
 * 
 * @typedef Pool
 * @type {object}
 * @property {string} id
 * @property {string} protocolVersion
 * @property {PoolValue} totalLiquidity
 * @property {number} feeTier
 * @property {PoolValue} volume30Day
 * @property {PoolValue} volume1Week
 * @property {PoolValue} volume1Day
 * @property {Token} token0
 * @property {Token} token1
 */

/**
 * @param {number} chainId
 * @returns {Promise<Pool[]>}
 */
export async function getPools (chainId) {
  const url = new URL("https://interface.gateway.uniswap.org/v2/uniswap.explore.v1.ExploreStatsService/ExploreStats")
  url.searchParams.append("connect", "v1")
  url.searchParams.append("encoding", "json")
  url.searchParams.append("message", `{"chainId":"${chainId}"}`)
  const res = await fetch(url, {
    "headers": {
      "origin": "https://app.uniswap.org",
    },
  });

  const { stats: { poolStats } } = await res.json()
  return poolStats
}
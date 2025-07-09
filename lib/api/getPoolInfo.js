

async function getPoolInfoV3 (address, chainName) {
  const res = await fetch("https://interface.gateway.uniswap.org/v1/graphql", {
    "headers": {
      "_dd-custom-header-graph-ql-operation-name": `V3Pool`,
      "_dd-custom-header-graph-ql-operation-type": "query",
      "origin": "https://app.uniswap.org/"
    },
    "body": JSON.stringify({
      operationName: "V3Pool",
      query: "query V3Pool($chain: Chain!, $address: String!) {\n  v3Pool(chain: $chain, address: $address) {\n    id\n    protocolVersion\n    address\n    feeTier\n    token0 {\n      ...SimpleTokenDetails\n      ...TokenPrice\n      __typename\n    }\n    token0Supply\n    token1 {\n      ...SimpleTokenDetails\n      ...TokenPrice\n      __typename\n    }\n    token1Supply\n    txCount\n    volume24h: cumulativeVolume(duration: DAY) {\n      value\n      __typename\n    }\n    historicalVolume(duration: WEEK) {\n      value\n      timestamp\n      __typename\n    }\n    totalLiquidity {\n      value\n      __typename\n    }\n    totalLiquidityPercentChange24h {\n      value\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SimpleTokenDetails on Token {\n  ...TokenBasicInfoParts\n  project {\n    id\n    isSpam\n    logoUrl\n    name\n    safetyLevel\n    __typename\n  }\n  ...TokenFeeDataParts\n  ...TokenProtectionInfoParts\n  __typename\n}\n\nfragment TokenBasicInfoParts on Token {\n  id\n  address\n  chain\n  decimals\n  name\n  standard\n  symbol\n  __typename\n}\n\nfragment TokenFeeDataParts on Token {\n  feeData {\n    buyFeeBps\n    sellFeeBps\n    __typename\n  }\n  __typename\n}\n\nfragment TokenProtectionInfoParts on Token {\n  protectionInfo {\n    result\n    attackTypes\n    blockaidFees {\n      buy\n      sell\n      transfer\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TokenPrice on Token {\n  id\n  project {\n    id\n    markets(currencies: [USD]) {\n      id\n      price {\n        id\n        value\n        __typename\n      }\n      __typename\n    }\n    logo {\n      id\n      url\n      __typename\n    }\n    __typename\n  }\n  market(currency: USD) {\n    id\n    price {\n      id\n      value\n      __typename\n    }\n    __typename\n  }\n  __typename\n}",
      variables: {
        chain: chainName, 
        address
      }
    }),
    "method": "POST"
  });
  if (!res.ok)
    throw new Error("Can't fetch pool info: " + res.statusText)
  const json = await res.json()
  return json.data.v3Pool
}

async function getPoolInfoV4 (address, chainName) {
  const res = await fetch("https://interface.gateway.uniswap.org/v1/graphql", {
    "headers": {
      "_dd-custom-header-graph-ql-operation-name": "V4Pool",
      "_dd-custom-header-graph-ql-operation-type": "query",
      "origin": "https://app.uniswap.org/"
    },
    "body": JSON.stringify({
      operationName: "V4Pool",
      query: "query V4Pool($chain: Chain!, $poolId: String!) {\n  v4Pool(chain: $chain, poolId: $poolId) {\n    id\n    protocolVersion\n    feeTier\n    isDynamicFee\n    poolId\n    hook {\n      id\n      address\n      __typename\n    }\n    token0 {\n      ...SimpleTokenDetails\n      ...TokenPrice\n      __typename\n    }\n    token0Supply\n    token1 {\n      ...SimpleTokenDetails\n      ...TokenPrice\n      __typename\n    }\n    token1Supply\n    txCount\n    volume24h: cumulativeVolume(duration: DAY) {\n      value\n      __typename\n    }\n    historicalVolume(duration: WEEK) {\n      value\n      timestamp\n      __typename\n    }\n    rewardsCampaign {\n      id\n      boostedApr\n      startTimestamp\n      endTimestamp\n      totalRewardAllocation\n      distributedRewards\n      __typename\n    }\n    totalLiquidity {\n      value\n      __typename\n    }\n    totalLiquidityPercentChange24h {\n      value\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SimpleTokenDetails on Token {\n  ...TokenBasicInfoParts\n  project {\n    id\n    isSpam\n    logoUrl\n    name\n    safetyLevel\n    __typename\n  }\n  ...TokenFeeDataParts\n  ...TokenProtectionInfoParts\n  __typename\n}\n\nfragment TokenBasicInfoParts on Token {\n  id\n  address\n  chain\n  decimals\n  name\n  standard\n  symbol\n  __typename\n}\n\nfragment TokenFeeDataParts on Token {\n  feeData {\n    buyFeeBps\n    sellFeeBps\n    __typename\n  }\n  __typename\n}\n\nfragment TokenProtectionInfoParts on Token {\n  protectionInfo {\n    result\n    attackTypes\n    blockaidFees {\n      buy\n      sell\n      transfer\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TokenPrice on Token {\n  id\n  project {\n    id\n    markets(currencies: [USD]) {\n      id\n      price {\n        id\n        value\n        __typename\n      }\n      __typename\n    }\n    logo {\n      id\n      url\n      __typename\n    }\n    __typename\n  }\n  market(currency: USD) {\n    id\n    price {\n      id\n      value\n      __typename\n    }\n    __typename\n  }\n  __typename\n}",
      variables: {
        chain: chainName, 
        poolId: address
      }
    }),    
    "method": "POST"
  });
  if (!res.ok)
    throw new Error("Can't fetch pool info: " + res.statusText)
  const json = await res.json()
  return json.data.v4Pool
}

const versionMap = {
  3: getPoolInfoV3,
  4: getPoolInfoV4
}

/**
 * @typedef PoolInfo
 * @type {object}
 * @property {import("./getPools").PoolValue} totalLiquidityPercentChange24h
 * 
 * @param {string} address 
 * @param {string} chainName 
 * @param {number} version 
 * @returns {Promise<PoolInfo>}
 */
export async function getPoolInfo (address, chainName, version) {
  return versionMap[version](address, chainName)
}

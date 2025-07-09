# Uniswap V3/V4 Pool stats

Get better stats than provide uniswap UI. 
- Filter by TVL > 500K$
- Remove V2 Pools
- Remove Pools with Hooks
- Sorted by Fee/1K D7 Fix

Fee/1K - Fee reward per $1000 investments per day

## Preview

![Preview](https://raw.githubusercontent.com/8clever/uniswap-pool-stats/refs/heads/main/docs/preview.webp)

Deltas Provide best information of what happening with TVL and Volume. Based on 30 Days, 7 Days, Last day

![Deltas](https://raw.githubusercontent.com/8clever/uniswap-pool-stats/refs/heads/main/docs/deltas.webp)

## Installation
```yarn workspaces focus --production```

## How to use
```yarn node main ARBITRUM```

## Supported chains
- ARBITRUM
- BASE
- UNICHAIN
- BSC
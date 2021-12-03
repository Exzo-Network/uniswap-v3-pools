import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import JSBI from "jsbi";
import { BigNumber } from "@ethersproject/bignumber";
import { Token } from "@uniswap/sdk-core";
import { Pool } from "@uniswap/v3-sdk";

import { getClient } from "../apollo/client";

const QUERY_POSITIONS = gql`
  query positionsByOwner($accounts: [String]!) {
    positions(where: { owner_in: $accounts }) {
      id
      token0 {
        id
        decimals
        symbol
        name
      }
      token1 {
        id
        decimals
        symbol
        name
      }
      pool {
        feeTier
        tick
        sqrtPrice
      }
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      liquidity
      feeGrowthInside0LastX128
      feeGrowthInside1LastX128
    }
  }
`;

export interface PositionState {
  id: BigNumber;
  token0: Token;
  token1: Token;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: BigNumber;
  pool: Pool;
  feeGrowthInside0LastX128: BigNumber;
  feeGrowthInside1LastX128: BigNumber;
}

export function useQueryPositions(
  chainId: number,
  accounts: string[]
): { loading: boolean; positionStates: PositionState[] } {
  const { loading, error, data } = useQuery(QUERY_POSITIONS, {
    variables: { accounts },
    fetchPolicy: "network-only",
    client: getClient(chainId),
  });

  if (loading) {
    return { loading: true, positionStates: [] };
  }

  if (error || !data) {
    return { loading: false, positionStates: [] };
  }

  const { positions } = data;
  const positionStates = positions.map((position: any) => {
    const id = BigNumber.from(position.id);
    const token0 = new Token(
      chainId,
      position.token0.id,
      parseInt(position.token0.decimals, 10),
      position.token0.symbol,
      position.token0.name
    );
    const token1 = new Token(
      chainId,
      position.token1.id,
      parseInt(position.token1.decimals, 10),
      position.token1.symbol,
      position.token1.name
    );
    const fee = parseInt(position.pool.feeTier, 10);
    const tickLower = parseInt(position.tickLower.tickIdx, 10);
    const tickUpper = parseInt(position.tickUpper.tickIdx, 10);
    const liquidity = BigNumber.from(position.liquidity);
    const feeGrowthInside0LastX128 = BigNumber.from(
      position.feeGrowthInside0LastX128
    );
    const feeGrowthInside1LastX128 = BigNumber.from(
      position.feeGrowthInside1LastX128
    );
    const sqrtPriceX96 = JSBI.BigInt(position.pool.sqrtPrice);
    const tickCurrent = parseInt(position.pool.tick, 10);

    if (Number.isNaN(tickCurrent)) {
      return null;
    }

    const pool = new Pool(
      token0 as Token,
      token1 as Token,
      fee,
      sqrtPriceX96,
      0,
      tickCurrent
    );

    return {
      id,
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      pool,
    };
  });

  return { loading: false, positionStates: positionStates };
}

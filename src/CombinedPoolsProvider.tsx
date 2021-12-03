import React, { ReactNode, useContext, useMemo } from "react";
import { WETH9, Token, CurrencyAmount } from "@uniswap/sdk-core";

import { PoolState } from "./hooks/usePoolsState";
import { useEthPrice } from "./hooks/useEthPrice";
import { usePoolsForNetwork } from "./hooks/usePoolsForNetwork";

import { DAI, USDC, USDT, PAX, FEI } from "./constants";
import { formatCurrency } from "./utils/numbers";
import { useAppSettings } from "./AppSettingsProvider";

const PoolsContext = React.createContext({
  pools: [] as PoolState[],
  totalLiquidity: 0,
  totalUncollectedFees: 0,
  convertToGlobal: (val: CurrencyAmount<Token>): number => {
    return 0;
  },
  convertToGlobalFormatted: (val: CurrencyAmount<Token>): string => {
    return "$0";
  },
  formatCurrencyWithSymbol: (val: number, chainId: number): string => {
    return "$0";
  },
  loading: true,
  empty: false,
});
export const usePools = () => useContext(PoolsContext);

interface Props {
  children: ReactNode;
}

export const CombinedPoolsProvider = ({ children }: Props) => {
  const ethPriceUSD = useEthPrice();
  const { getGlobalCurrencyToken } = useAppSettings();

  const { loading: mainnetLoading, pools: mainnetPools } =
    usePoolsForNetwork(1);
  const { loading: optimismLoading, pools: optimismPools } =
    usePoolsForNetwork(10);
  const { loading: arbitrumLoading, pools: arbitrumPools } =
    usePoolsForNetwork(42161);

  const loading = useMemo(() => {
    return mainnetLoading || optimismLoading || arbitrumLoading;
  }, [mainnetLoading, optimismLoading, arbitrumLoading]);

  const pools = useMemo(() => {
    return [...mainnetPools, ...arbitrumPools, ...optimismPools];
  }, [mainnetPools, arbitrumPools, optimismPools]);

  const empty = useMemo(() => !loading && !pools.length, [loading, pools]);

  const isStableCoin = (token: Token): boolean => {
    if (token.equals(DAI[token.chainId])) {
      return true;
    } else if (token.equals(USDC[token.chainId])) {
      return true;
    } else if (token.equals(USDT[token.chainId])) {
      return true;
    } else if (token.equals(PAX)) {
      return true;
    } else if (token.equals(FEI)) {
      return true;
    }

    return false;
  };

  const convertToGlobal = (val: CurrencyAmount<Token>): number => {
    const valFloat = parseFloat(val.toSignificant(15));
    const globalCurrencyToken = getGlobalCurrencyToken(val.currency.chainId);
    if (
      val.currency.equals(globalCurrencyToken) ||
      (globalCurrencyToken.equals(USDC[val.currency.chainId]) &&
        isStableCoin(val.currency))
    ) {
      return valFloat;
    }

    if (globalCurrencyToken.equals(WETH9[val.currency.chainId])) {
      return valFloat / ethPriceUSD;
    } else {
      return valFloat * ethPriceUSD;
    }
  };

  const formatCurrencyWithSymbol = (val: number, chainId: number): string => {
    const currencySymbol = getGlobalCurrencyToken(chainId).equals(USDC[chainId])
      ? "$"
      : "Ξ";
    return formatCurrency(val, currencySymbol);
  };

  const convertToGlobalFormatted = (val: CurrencyAmount<Token>): string => {
    return formatCurrencyWithSymbol(convertToGlobal(val), val.currency.chainId);
  };

  // sort pools by liquidity
  const sortedPools = pools.sort((a, b) => {
    const aLiq = convertToGlobal(a.poolLiquidity);
    const bLiq = convertToGlobal(b.poolLiquidity);
    return bLiq - aLiq;
  });

  // calculate total
  const [totalLiquidity, totalUncollectedFees] = pools.reduce(
    (accm, pool) => {
      let totalLiquidity = 0;
      let totalUncollectedFees = 0;

      const { poolLiquidity, poolUncollectedFees } = pool;

      const poolLiquidityInGlobal = convertToGlobal(poolLiquidity);
      const uncollectedFeesInGlobal = convertToGlobal(poolUncollectedFees);

      totalLiquidity = accm[0] + poolLiquidityInGlobal;
      totalUncollectedFees = accm[1] + uncollectedFeesInGlobal;

      return [totalLiquidity, totalUncollectedFees];
    },
    [0, 0]
  );

  return (
    <PoolsContext.Provider
      value={{
        pools: sortedPools,
        totalLiquidity,
        totalUncollectedFees,
        convertToGlobal,
        convertToGlobalFormatted,
        formatCurrencyWithSymbol,
        empty,
        loading,
      }}
    >
      {children}
    </PoolsContext.Provider>
  );
};

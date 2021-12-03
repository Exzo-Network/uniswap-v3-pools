import React, { ReactNode, useContext, useCallback } from "react";
import { WETH9, Token } from "@uniswap/sdk-core";
import createPersistedState from "use-persisted-state";

import { USDC } from "./constants";

const AppSettingsContext = React.createContext(null as any);
export const useAppSettings = () => useContext(AppSettingsContext);

const useFilterClosedState = createPersistedState("app-filter-closed");
const useGlobalCurrencyState = createPersistedState("app-global-currency");

interface Props {
  children: ReactNode;
}

export const AppSettingsProvider = ({ children }: Props) => {
  const [filterClosed, setFilterClosed] = useFilterClosedState(false);
  const [globalCurrency, setGlobalCurrency] = useGlobalCurrencyState("usd");

  const getGlobalCurrencyToken = useCallback(
    (chainId: number) => {
      const tokens: { [name: string]: Token } = {
        usd: USDC[chainId],
        eth: WETH9[chainId],
      };
      return tokens[globalCurrency] || tokens["usd"];
    },
    [globalCurrency]
  );

  return (
    <AppSettingsContext.Provider
      value={{
        filterClosed,
        setFilterClosed,
        globalCurrency,
        getGlobalCurrencyToken,
        setGlobalCurrency,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

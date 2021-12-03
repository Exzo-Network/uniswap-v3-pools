import { ApolloClient, InMemoryCache } from "@apollo/client";

export const mainnetClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/laktek/uniswap-v3-mainnet",
  cache: new InMemoryCache(),
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const ropstenClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-ropsten",
  cache: new InMemoryCache(),
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const arbitrumClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/laktek/uniswap-v3-arbitrum",
  cache: new InMemoryCache(),
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const optimismClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/laktek/uniswap-v3-optimism",
  cache: new InMemoryCache(),
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export function getClient(chainId: number) {
  const clients: { [key: number]: any } = {
    1: mainnetClient,
    10: optimismClient,
    42161: arbitrumClient,
  };

  return clients[chainId] || mainnetClient;
}

export const healthClient = new ApolloClient({
  uri: "https://api.thegraph.com/index-node/graphql",
  cache: new InMemoryCache(),
});

export const blockClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
  cache: new InMemoryCache(),
});

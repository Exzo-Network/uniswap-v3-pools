import React from 'react';
import { Token } from '@uniswap/sdk-core';
import { Pool } from '@uniswap/v3-sdk';
import IconHelper from '.././../icons/Helper';

import Position from './Position';
import Tooltip from '../../ui/Tooltip';
import { LABELS } from '../../content/tooltip';

interface Props {
  positions: any[];
  pool: Pool;
  baseToken: Token;
  quoteToken: Token;
}

function Positions({ positions, pool, baseToken, quoteToken }: Props) {
  return (
    <div className="w-full flex overflow-x-auto flex-col my-4 border border-element-10">
      <table className="table-auto w-full text-high text-0.875">
        <thead className="bg-surface-10">
          <tr className="text-left text-0.875 align-top">
            <th className="pb-3 px-4 py-3 whitespace-nowrap">Range</th>
            <th className="pb-3 px-4 py-3 whitespace-nowrap">Distribution</th>
            <th className="pb-3 px-4 py-3 whitespace-nowrap">Liquidity</th>
            <th className="pb-3 px-4 py-3 whitespace-nowrap">Uncl. fees</th>
            <th className="pb-3 px-4 py-3">
              <Tooltip label={LABELS.FEE_APY} placement="top">
                <span className="flex items-center cursor-default whitespace-nowrap">
                  Fee APY
                  <IconHelper className="ml-1" />
                </span>
              </Tooltip>
            </th>
            <th className="pb-3 px-4 py-3">
              <Tooltip label={LABELS.NET_RETURN} placement="top">
                <span className="flex items-center cursor-default whitespace-nowrap">
                  Net Return
                  <IconHelper className="ml-1" />
                </span>
              </Tooltip>
            </th>
            <th className="hidden md:block pb-3 px-4 py-3">
              <Tooltip label={LABELS.NET_APY} placement="top">
                <span className="flex items-center cursor-default whitespace-nowrap">
                  Net Return
                  <IconHelper className="ml-1" />
                </span>
              </Tooltip>
            </th>
            <th className="pb-3 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="text-0.875 align-middle">
          {positions.map((position) => (
            <Position
              key={position.id.toString()}
              pool={pool}
              baseToken={baseToken}
              quoteToken={quoteToken}
              {...position}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Positions;

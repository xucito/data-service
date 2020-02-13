import { BigNumber } from '@turtlenetwork/bignumber';
import { curry } from 'ramda';

export const convertPrice = curry(
  (aDecimals: number, pDecimals: number, price: BigNumber): BigNumber =>
    price.mul(new BigNumber(10).pow(-8 + aDecimals - pDecimals))
);

export const convertAmount = curry(
  (decimals: number, amount: BigNumber): BigNumber =>
    amount.mul(new BigNumber(10).pow(-decimals))
);

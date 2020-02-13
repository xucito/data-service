import { BigNumber } from '@turtlenetwork/bignumber';

export const toBigNumber = (x: BigNumber | string): BigNumber => new BigNumber(x);

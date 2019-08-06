import { createOrderPair } from '@waves/assets-pairs-order'
import { Validator } from '.';
import { of as taskOf } from 'folktale/concurrency/task';

export type AssetsPair = {
  asset1: string,
  asset2: string
}

export const AssetsPair = {
  create(asset1: string, asset2: string): AssetsPair {
    return {
      asset1,
      asset2
    }
  },

  createFromTuple([asset1, asset2]: [string, string]): AssetsPair {
    return AssetsPair.create(asset1, asset2)
  }
}

export type TradingPair = {
  amountAsset: string,
  priceAsset: string
}

export function getPairOrderValidator(predefinedAssetsList: string[]): Validator<Error, AssetsPair> {
  const pairFn = createOrderPair(predefinedAssetsList);

  return (data: AssetsPair) => {
    const [correctId1, correctId2] = pairFn(data.asset1, data.asset2)

    if (correctId1 === data.asset1 && correctId2 === data.asset2) {
      return taskOf({ ...data })
    }

    // TODO: specify error
    throw new Error("incorrect pair order")
  }
}

// export const pairIdsValidator: Validator<Error, AssetsPair> = (data: AssetsPair) =>
  

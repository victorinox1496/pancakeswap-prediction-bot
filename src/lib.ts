import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { underline } from "chalk";
import {
  CandleGeniePredictionV3,
  PancakePredictionV2,
} from "./types/typechain";

// Utility Function to use **await sleep(ms)**
export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const reduceWaitingTimeByTwoBlocks = (waitingTime: number) => {
  if (waitingTime <= 6000) {
    return waitingTime;
  }

  return waitingTime - 6000;
};

export const getClaimableEpochs = async (
  predictionContract: PancakePredictionV2,
  epoch: BigNumber,
  userAddress: string
) => {
const claimableEpochs: BigNumber[] = [];

for (let i = 1; i <= 5; i++) {
  const epochToCheck = epoch.sub(i);

  const [claimable, refundable, { claimed, amount }] = await Promise.all([
    predictionContract.claimable(epochToCheck, userAddress),
    predictionContract.refundable(epochToCheck, userAddress),
    predictionContract.ledger(epochToCheck, userAddress),
  ]);

  if (amount.gt(0) && (claimable || refundable) && !claimed) {
    claimableEpochs.push(epochToCheck);
  }
}

return claimableEpochs;
};

export const calcRets = (amount: BigNumber | undefined) => {
  if (!amount || amount.div(25).lt(parseEther("0.005"))) {
    return parseEther("0.005");
  }

  return amount.div(25);
};

export const getClaimableEpochsCG = async (
  predictionContract: CandleGeniePredictionV3,
  epoch: BigNumber,
  userAddress: string
) => {
const claimableEpochs: BigNumber[] = [];

for (let i = 1; i <= 5; i++) {
  const epochToCheck = epoch.sub(i);

  const [claimable, refundable, { claimed, amount }] = await Promise.all([
    predictionContract.claimable(epochToCheck, userAddress),
    predictionContract.refundable(epochToCheck, userAddress),
    predictionContract.Bets(epochToCheck, userAddress),
  ]);

  if (amount.gt(0) && (claimable || refundable) && !claimed) {
    claimableEpochs.push(epochToCheck);
  }
}

return claimableEpochs;
};
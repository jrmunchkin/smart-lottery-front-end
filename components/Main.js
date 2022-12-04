import { useMoralis } from "react-moralis";
import { constants } from "ethers";
import networkMapping from "../constants/contractAddresses.json";
import LastWinnerBox from "./infos-boxes/LastWinnerBox";
import HistoryBox from "./infos-boxes/HistoryBox";
import PlayLotteryBox from "./play-lottery-box/PlayLotteryBox";
import RewardsBox from "./rewards-box/RewardsBox";

export default function Main() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);

  if (!isWeb3Enabled) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please connect your wallet!</h1>
      </div>
    );
  }

  if (!chainId || !networkMapping[chainId]) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">
          Please use Goerli network or a local hardhat node!
        </h1>
      </div>
    );
  }

  const smartLotteryAddress = chainId
    ? networkMapping[chainId][networkMapping[chainId].length - 1]
    : constants.AddressZero;

  return (
    <div className="text-center">
      <div className="inline-flex gap-10">
        <LastWinnerBox smartLotteryAddress={smartLotteryAddress} />
        <HistoryBox smartLotteryAddress={smartLotteryAddress} />
        <RewardsBox smartLotteryAddress={smartLotteryAddress} />
      </div>
      <div className="p-4">
        <div className="inline-flex gap-10">
          <PlayLotteryBox smartLotteryAddress={smartLotteryAddress} />
        </div>
      </div>
    </div>
  );
}

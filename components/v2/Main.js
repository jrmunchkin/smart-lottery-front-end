import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import React, { Fragment } from "react";
import { constants } from "ethers";
import { useBetween } from "use-between";
import { useLotteryV2 } from "../../hooks/useLotteryV2";
import networkMapping from "../../constants/contractAddresses.json";
import smartLotteryAbi from "../../constants/smartLotteryV2.json";
import LotteryBox from "./lottery-box/LotteryBox";
import TicketsBox from "./tickets-box/TicketsBox";
import WinningTicketBox from "./winning-ticket-box/WinningTicketBox";
import RewardsBox from "./rewards-box/RewardsBox";
import HistoryBox from "./history-box/HistoryBox";

export default function Main() {
  const { isLotteryChange, setIsLotteryChange } = useBetween(useLotteryV2);
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [lotteryNumber, setLotteryNumber] = useState(0);
  const [loadGame, setLoadGame] = useState(false);

  const smartLotteryAddress = chainId
    ? networkMapping[chainId]["SmartLotteryV2"][
        networkMapping[chainId]["SmartLotteryV2"].length - 1
      ]
    : constants.AddressZero;

  const { runContractFunction: getActualLotteryNumber } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getActualLotteryNumber",
    params: {},
  });

  async function updateUI() {
    const lotteryNumberFromCall = (await getActualLotteryNumber()).toNumber();
    setLotteryNumber(lotteryNumberFromCall);
    setLoadGame(true);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
      if (isLotteryChange == true) {
        setIsLotteryChange(false);
      }
    }
  }, [isWeb3Enabled, account, isLotteryChange]);

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
        <h1 className="text-white text-2xl p-4">Please use Goerli network!</h1>
      </div>
    );
  }

  return (
    <div className="text-center">
      {loadGame ? (
        <Fragment>
          <div className="inline-flex gap-10">
            <div className="flex  flex-col">
              <WinningTicketBox lotteryNumber={lotteryNumber} />
              <RewardsBox smartLotteryAddress={smartLotteryAddress} />
              <HistoryBox
                smartLotteryAddress={smartLotteryAddress}
                lotteryNumber={lotteryNumber}
              />
            </div>
            <LotteryBox
              smartLotteryAddress={smartLotteryAddress}
              lotteryNumber={lotteryNumber}
            />
            <TicketsBox
              smartLotteryAddress={smartLotteryAddress}
              lotteryNumber={lotteryNumber}
            />
          </div>
        </Fragment>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { truncateStr } from "../../../utils/utils";
import { useBetween } from "use-between";
import { useLottery } from "../../../hooks/useLottery";
import smartLotteryAbi from "../../../constants/smartLottery.json";

export default function LastWinnerBox({ smartLotteryAddress }) {
  const { lotteryNumber } = useBetween(useLottery);
  const { isWeb3Enabled, account } = useMoralis();
  const [lastWinner, setLastWinner] = useState("");

  const { runContractFunction: getWinner } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getWinner",
    params: {
      _lotteryNumber: lotteryNumber - 1,
    },
  });

  async function updateUI() {
    if (lotteryNumber - 1 > 0) {
      const lastWinnerFromCall = await getWinner();
      setLastWinner(
        lastWinnerFromCall.toUpperCase() == account.toUpperCase()
          ? "You!!"
          : truncateStr(lastWinnerFromCall, 15) + " win!! "
      );
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, lotteryNumber, account]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4">Last winner!</h1>
      <div className="box-border w-80 md:w-330 xl:w-96 h-40 rounded-lg p-4 border-2 bg-white">
        <div className="flex-col flex items-center">
          <div className="p-2">
            {lotteryNumber - 1 <= 0
              ? "No lottery yet"
              : "Lottery number " + (lotteryNumber - 1)}
          </div>
          <div className="font-bold text-2xl">{lastWinner}</div>
        </div>
      </div>
    </div>
  );
}

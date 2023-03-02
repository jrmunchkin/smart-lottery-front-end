import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { Input } from "web3uikit";
import { truncateStr } from "../../../utils/utils";
import smartLotteryAbi from "../../../constants/smartLottery.json";

export default function HistoryBox({ smartLotteryAddress }) {
  const { isWeb3Enabled, account } = useMoralis();
  const [winner, setWinner] = useState("");
  const [selectedLotteryNumber, setSelectedLotteryNumber] = useState("");

  const { runContractFunction: getActualLotteryNumber } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getActualLotteryNumber",
    params: {},
  });

  const { runContractFunction: getWinner } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getWinner",
    params: {
      _lotteryNumber: selectedLotteryNumber,
    },
  });

  const { runContractFunction: getLotteryBalance } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getLotteryBalance",
    params: {
      _lotteryNumber: selectedLotteryNumber,
    },
  });

  async function setWinnerDisplay() {
    const lotteryNumberWinner = await getWinner();
    const balanceFromCall = (await getLotteryBalance()).toString();
    const formattedBalance = balanceFromCall
      ? Math.round(
          (parseFloat(formatUnits(balanceFromCall, 18)) + Number.EPSILON) * 1e5
        ) / 1e5
      : 0;
    setWinner(
      lotteryNumberWinner.toUpperCase() == account.toUpperCase()
        ? "You win " + formattedBalance + " ETH"
        : truncateStr(lotteryNumberWinner, 15) +
            " win " +
            formattedBalance +
            " ETH"
    );
  }

  async function updateUI() {
    const actualLotteryNumber = await getActualLotteryNumber();
    if (selectedLotteryNumber === "") {
      setWinner("");
    } else if (selectedLotteryNumber >= actualLotteryNumber.toNumber()) {
      setWinner("No winner yet for this lottery!!");
    } else if (selectedLotteryNumber <= 0) {
      setWinner("Lottery doesn't exist!!");
    } else {
      await setWinnerDisplay();
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, selectedLotteryNumber]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4">Look at the previous winners!</h1>
      <div className="box-border w-80 md:w-330 xl:w-96 rounded-lg p-4 border-2 bg-white">
        <div className="flex-col flex items-center">
          <div className="p-2">Enter a number to see the winner</div>
          <div className="font-bold text-lg">{winner}</div>
        </div>
        <div className="flex items-center flex-col p-4">
          <Input
            type="number"
            width="200px"
            value={selectedLotteryNumber}
            onChange={(event) => {
              setSelectedLotteryNumber(event.target.value);
            }}
          ></Input>
        </div>
      </div>
    </div>
  );
}

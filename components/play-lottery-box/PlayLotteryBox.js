import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { Button, useNotification } from "web3uikit";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useBetween } from "use-between";
import { useLottery } from "../../hooks/useLottery";
import smartLotteryAbi from "../../constants/smartLottery.json";

export default function PlayLotteryBox({ smartLotteryAddress }) {
  const { setIsLotteryChange, lotteryNumber, setLotteryNumber } =
    useBetween(useLottery);
  const { isWeb3Enabled, account } = useMoralis();
  const [interval, setInterval] = useState(0);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [lotteryBalance, setLotteryBalance] = useState("0");
  const [isAlreadyPlaying, setIsAlreadyPlaying] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const [renderTimer, setRenderTimer] = useState(false);
  const [lotteryStateChange, setLotteryStateChange] = useState(0);
  const [startChecking, setStartChecking] = useState(false);
  const [lotteryIsCalculating, setLotteryIsCalculating] = useState(false);

  const dispatch = useNotification();

  const { runContractFunction: getActualLotteryNumber } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getActualLotteryNumber",
    params: {},
  });

  const { runContractFunction: getStartTimestamp } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getStartTimestamp",
    params: {},
  });

  const { runContractFunction: getInterval } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getInterval",
    params: {},
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getActualLotteryBalance } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getActualLotteryBalance",
    params: {},
  });

  const { runContractFunction: isPlayerAlreadyInLottery } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "isPlayerAlreadyInLottery",
    params: {
      _user: account,
    },
  });

  const { runContractFunction: getLotteryState } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getLotteryState",
    params: {},
  });

  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  async function timerOver() {
    const LastLotteryNumber = (await getActualLotteryNumber()).toNumber();
    if (LastLotteryNumber === lotteryNumber) {
      await updateLotteryState();
      setShouldRepeat(true);
    } else {
      setShouldRepeat(false);
      setIsLotteryChange(true);
      setLotteryIsCalculating(false);
      updateUI();
    }
  }

  async function calculateRemaingTime() {
    setShouldRepeat(false);
    const interval = (await getInterval()).toNumber();
    const startTime = (await getStartTimestamp()).toNumber();
    const endTime = startTime + interval + 4 * 60;
    const now = Date.now() / 1000;
    if (endTime - now < 0) {
      setShouldRepeat(true);
    }
    setRemaining(endTime - now);
  }

  async function updateLotteryState() {
    setRenderTimer(false);
    const numPlayersFromCall = (await getNumberOfPlayers()).toNumber();
    setNumPlayers(numPlayersFromCall);
    const lotteryBalanceFromCall = (await getActualLotteryBalance()).toString();
    const formattedLotteryBalance = lotteryBalanceFromCall
      ? Math.round(
          (parseFloat(formatUnits(lotteryBalanceFromCall, 18)) +
            Number.EPSILON) *
            1e5
        ) / 1e5
      : 0;
    setLotteryBalance(formattedLotteryBalance);
    if (numPlayersFromCall > 0) {
      setStartChecking(true);
      await calculateRemaingTime();
    }
    setRenderTimer(true);
  }

  async function updateUI() {
    const intervalFromCall = (await getInterval()).toNumber();
    setInterval(intervalFromCall);
    const lotteryNumberFromCall = (await getActualLotteryNumber()).toNumber();
    setLotteryNumber(lotteryNumberFromCall);
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    setEntranceFee(entranceFeeFromCall);
    const isAlreadyPlayingFromCall = await isPlayerAlreadyInLottery();
    setIsAlreadyPlaying(isAlreadyPlayingFromCall);
    await updateLotteryState();
  }

  const handleEnterLotterySuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your are in the game!",
      title: "Enter to lottery",
      position: "topR",
    });
    updateUI();
  };

  const handleEnterLotteryError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else
      message =
        "The lottery is not open yet or you don't send enough funds or you are already inside the lottery";
    dispatch({
      type: "error",
      message: message,
      title: "Error enter lottery!",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account]);

  useEffect(() => {
    if (startChecking) {
      setTimeout(async () => {
        const lotteryStateFromCall = await getLotteryState();
        if (lotteryStateFromCall === 1) {
          setLotteryIsCalculating(true);
          setStartChecking(false);
        } else {
          console.log("ok");
          setLotteryStateChange(lotteryStateChange + 1);
        }
      }, 5000);
    }
  }, [lotteryStateChange, startChecking]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4"> Play the lottery now! </h1>
      <div className="box-border w-96 rounded-lg border-2 bg-white">
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center">
            <div className="font-bold text-2xl">
              {"Lottery Number : " + lotteryNumber}
            </div>
          </div>
          <div className="inline-flex items-center">
            <div className="font-bold text-sm">
              {"Entrance fee : " +
                Math.round(
                  (parseFloat(formatUnits(entranceFee, 18)) + Number.EPSILON) *
                    1e5
                ) /
                  1e5}
            </div>
            <img className="w-5" src="/images/eth.png" alt="eth logo"></img>
          </div>
          <div className="inline-flex items-center">
            <div className="font-bold text-sm">
              {"Actual players : " + numPlayers}
            </div>
          </div>
          <div className="inline-flex items-center">
            <div className="font-bold text-sm">
              {"Pot size : " + lotteryBalance}
            </div>
            <img className="w-5" src="/images/eth.png" alt="eth logo"></img>
          </div>
          <div className="p-4">
            <Button
              text={
                isAlreadyPlaying
                  ? "Already in the game!"
                  : lotteryIsCalculating
                  ? "Lottery is picking winner..."
                  : "Enter lottery!"
              }
              size="xl"
              theme="colored"
              color="blue"
              onClick={async function () {
                await enterLottery({
                  onError: handleEnterLotteryError,
                  onSuccess: handleEnterLotterySuccess,
                });
              }}
              disabled={
                isLoading ||
                isFetching ||
                isAlreadyPlaying ||
                lotteryIsCalculating
              }
              isLoading={isLoading || isFetching}
            />
          </div>
          {numPlayers > 0 && renderTimer ? (
            <div className="flex items-center flex-col">
              <div className="">
                {shouldRepeat
                  ? "Take a cup of coffee, it's longer than usual..."
                  : "Time remaining before lottery ends :"}
              </div>
              <CountdownCircleTimer
                isPlaying
                size="120"
                duration={shouldRepeat ? interval : interval + 4 * 60}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[interval + 4 * 60, 2 * 60, 1 * 60, 0]}
                initialRemainingTime={shouldRepeat ? interval : remaining}
                onComplete={async (totalElapsedTime) => {
                  await timerOver();
                  return {
                    shouldReapeat: shouldRepeat,
                    newInitialRemainingTime: interval,
                  };
                }}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>
          ) : !renderTimer ? (
            "Loading..."
          ) : (
            "Lottery haven't start yet, need at least 1 player"
          )}
        </div>
      </div>
    </div>
  );
}

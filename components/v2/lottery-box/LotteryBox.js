import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Tooltip } from "web3uikit";
import { Info } from "@web3uikit/icons";
import { formatUnits } from "@ethersproject/units";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useBetween } from "use-between";
import { useLotteryV2 } from "../../../hooks/useLotteryV2";
import smartLotteryAbi from "../../../constants/smartLotteryV2.json";
import GET_WINNING_TICKET_FOR_LOTTERY from "../../../subgraph/query-winning-ticket";
import GET_REQUEST_WINNING_TICKET_FOR_LOTTERY from "../../../subgraph/query-request-winning-ticket";
import LotteryRulesModal from "./LotteryRulesModal";
import LotteryPots from "./LotteryPots";

export default function LotteryBox({ smartLotteryAddress, lotteryNumber }) {
  const { fetchingTickets, setIsLotteryChange, setLotteryIsCalculating } =
    useBetween(useLotteryV2);
  const { isWeb3Enabled, account } = useMoralis();
  const [interval, setInterval] = useState(0);
  const [prizeDistribution, setPrizeDistribution] = useState([]);
  const [numPlayers, setNumPlayers] = useState("0");
  const [lotteryBalance, setLotteryBalance] = useState("0");
  const [remaining, setRemaining] = useState(0);
  const [shouldRepeat, setShouldRepeat] = useState(false);
  const [renderTimer, setRenderTimer] = useState(false);
  const [lotteryStateChange, setLotteryStateChange] = useState(0);
  const [startChecking, setStartChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);

  const { refetch: refetchWinningTickets } = useQuery(
    GET_WINNING_TICKET_FOR_LOTTERY,
    {
      variables: {
        lotteryNumber: lotteryNumber,
      },
    }
  );

  const { refetch: refetchRequestWinningTickets } = useQuery(
    GET_REQUEST_WINNING_TICKET_FOR_LOTTERY,
    {
      variables: {
        lotteryNumber: lotteryNumber,
      },
    }
  );

  const { runContractFunction: getPrizeDistribution } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getPrizeDistribution",
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

  async function timerOver() {
    const result = await refetchWinningTickets();
    if (result.data.winningTicketLotteryPickeds.length > 0) {
      setShouldRepeat(false);
      setIsLotteryChange(true);
      setLotteryIsCalculating(false);
      updateUI();
    } else {
      await updateUI();
      setShouldRepeat(true);
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

  async function updateUI() {
    setRenderTimer(false);
    const prizeDistributionFromCall = await getPrizeDistribution();
    setPrizeDistribution(prizeDistributionFromCall);
    const intervalFromCall = (await getInterval()).toNumber();
    setInterval(intervalFromCall);
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

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account, lotteryNumber, fetchingTickets]);

  useEffect(() => {
    if (startChecking) {
      setTimeout(async () => {
        const result = await refetchRequestWinningTickets();
        if (result.data.requestLotteryWinningTickets.length > 0) {
          setLotteryIsCalculating(true);
          setStartChecking(false);
        } else {
          setLotteryStateChange(lotteryStateChange + 1);
        }
      }, 5000);
    }
  }, [lotteryStateChange, startChecking]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4"> See the lottery! </h1>
      <div className="box-border w-80 md:w-330 xl:w-96 h-600 rounded-lg border-2 bg-white">
        <div className="flex absolute items-end flex-col">
          <LotteryRulesModal
            isVisible={showModal}
            onClose={hideModal}
            prizeDistribution={prizeDistribution}
          />
          <Tooltip content="See rules" position="top">
            <Button
              icon={<Info fontSize="30px" />}
              iconLayout="icon-only"
              theme="outline"
              onClick={() => {
                setShowModal(true);
              }}
            />
          </Tooltip>
        </div>
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center">
            <div className="font-bold text-2xl">
              {"Lottery Number : " + lotteryNumber}
            </div>
          </div>
          <div className="p-4">
            {numPlayers > 0 && renderTimer ? (
              <div className="flex items-center flex-col">
                <div className="">
                  {shouldRepeat
                    ? "Take a cup of coffee, it's longer than usual"
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
              "Lottery haven't start yet, at least 1 ticket need to be buy"
            )}
          </div>
          <div className="p-4">
            <LotteryPots
              prizeDistribution={prizeDistribution}
              lotteryBalance={lotteryBalance}
              nbPlayers={numPlayers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

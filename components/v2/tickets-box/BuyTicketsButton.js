import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { Input, Button, useNotification } from "web3uikit";
import { ethers } from "ethers";
import { formatUnits } from "@ethersproject/units";
import { useBetween } from "use-between";
import { useLotteryV2 } from "../../../hooks/useLotteryV2";
import smartLotteryAbi from "../../../constants/smartLotteryV2.json";

export default function BuyTicketsButton({ smartLotteryAddress }) {
  const { fetchingTickets, setFetchingTickets, lotteryIsCalculating } =
    useBetween(useLotteryV2);
  const { isWeb3Enabled, account } = useMoralis();
  const [nbTickets, setNbTickets] = useState("0");
  const [ticketFee, setTicketFee] = useState("0");
  const [buyTicketLoading, setBuyTicketLoading] = useState(false);

  const dispatch = useNotification();

  const { runContractFunction: getTicketFee } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getTicketFee",
    params: {},
  });

  //Transaction call with ethers due to gasLimit issue (cannot set gasLimit with useWeb3Contract hook)
  async function buyTickets() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const smartLotteryContract = new ethers.Contract(
      smartLotteryAddress,
      smartLotteryAbi,
      signer
    );
    try {
      setBuyTicketLoading(true);
      const txResponse = await smartLotteryContract.buyTickets(nbTickets, {
        value: (ticketFee * nbTickets).toString(),
        gasLimit: "10000000",
      });
      setBuyTicketLoading(false);
      handleBuyTicketsSuccess(txResponse);
    } catch (error) {
      setBuyTicketLoading(false);
      handleBuyTicketsError(error);
    }
  }

  const handleBuyTicketsSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Tickets successfully bought!",
      title: "Tickets bought",
      position: "topR",
    });
    setFetchingTickets(fetchingTickets + 1);
  };

  const handleBuyTicketsError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else
      message =
        "The lottery is not open yet or you don't send enough funds or you already buy the maximum ticket capacity";
    dispatch({
      type: "error",
      message: message,
      title: "Error buying tickets!",
      position: "topR",
    });
  };

  async function updateUI() {
    const ticketFeeFromCall = (await getTicketFee()).toString();
    setTicketFee(ticketFeeFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account]);

  return (
    <div className="flex-col flex items-center">
      <Input
        type="number"
        width="250px"
        value={nbTickets}
        onChange={(event) => {
          setNbTickets(event.target.value);
        }}
        validation={{
          numberMin: 0,
          numberMax: 10,
        }}
      ></Input>
      <div className="p-3 inline-flex items-center">
        <Button
          text={
            lotteryIsCalculating ? "Picking winning ticket" : "Buy Tickets!"
          }
          size="xl"
          theme="colored"
          color="blue"
          onClick={async function () {
            await buyTickets();
          }}
          disabled={buyTicketLoading || lotteryIsCalculating}
          isLoading={buyTicketLoading}
        />
      </div>
      <div className="inline-flex items-center">
        <div className="font-bold text-sm">
          {"1 ticket = " +
            Math.round(
              (parseFloat(formatUnits(ticketFee, 18)) + Number.EPSILON) * 1e5
            ) /
              1e5}
        </div>
        <img className="w-5" src="/images/eth.png" alt="eth logo"></img>
      </div>
    </div>
  );
}

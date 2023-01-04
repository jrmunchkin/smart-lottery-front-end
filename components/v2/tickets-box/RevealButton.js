import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { Button, useNotification } from "web3uikit";
import { useBetween } from "use-between";
import { useLotteryV2 } from "../../../hooks/useLotteryV2";
import smartLotteryAbi from "../../../constants/smartLotteryV2.json";

export default function RevealButton({
  smartLotteryAddress,
  lotteryNumber,
  fetching,
  listedData,
}) {
  const { fetchingTickets, setFetchingTickets } = useBetween(useLotteryV2);
  const { isWeb3Enabled, account } = useMoralis();
  const [isTicketAlreadyRevealed, setIsTicketAlreadyRevealed] = useState(false);

  const dispatch = useNotification();

  const { runContractFunction: isPlayerTicketAlreadyRevealed } =
    useWeb3Contract({
      abi: smartLotteryAbi,
      contractAddress: smartLotteryAddress,
      functionName: "isPlayerTicketAlreadyRevealed",
      params: {
        _user: account,
        _lotteryNumber: lotteryNumber,
      },
    });

  const {
    runContractFunction: revealWinningTickets,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "revealWinningTickets",
    params: {
      _lotteryNumber: lotteryNumber,
    },
  });

  const handleRevealWinningTicketsSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Tickets successfully revealed!",
      title: "Tickets revealed",
      position: "topR",
    });
    setFetchingTickets(fetchingTickets + 1);
  };

  const handleRevealWinningTicketsError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure the lottery number is correct?";
    dispatch({
      type: "error",
      message: message,
      title: "Error revealing tickets!",
      position: "topR",
    });
  };

  async function updateUI() {
    const isPlayerTicketAlreadyRevealedFromCall =
      await isPlayerTicketAlreadyRevealed();
    setIsTicketAlreadyRevealed(isPlayerTicketAlreadyRevealedFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account, lotteryNumber, fetchingTickets]);

  return (
    <div className="flex-col flex items-center">
      <div className="flex-col flex">
        {listedData == undefined ? (
          "Loading..."
        ) : (
          <Button
            text={
              isTicketAlreadyRevealed
                ? "Already revealed"
                : listedData.emitTickets.length == 0
                ? "Nothing to reveal"
                : "Reveal winning tickets"
            }
            size="xl"
            theme="colored"
            color="green"
            onClick={async function () {
              await revealWinningTickets({
                onError: handleRevealWinningTicketsError,
                onSuccess: handleRevealWinningTicketsSuccess,
              });
            }}
            disabled={
              isLoading ||
              isFetching ||
              fetching ||
              isTicketAlreadyRevealed ||
              listedData.emitTickets == 0
            }
            isLoading={isLoading || isFetching || fetching}
          />
        )}
      </div>
    </div>
  );
}

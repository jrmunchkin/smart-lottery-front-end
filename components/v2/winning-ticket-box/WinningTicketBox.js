import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import GET_WINNING_TICKET_FOR_LOTTERY from "../../../subgraph/query-winning-ticket";

export default function WinningTicketBox({ lotteryNumber }) {
  const { isWeb3Enabled, account } = useMoralis();

  const {
    loading: fetchingWinningTicket,
    error,
    data: listedWinningTicket,
    refetch: refetchWinningTicket,
  } = useQuery(GET_WINNING_TICKET_FOR_LOTTERY, {
    variables: {
      lotteryNumber: lotteryNumber - 1,
    },
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      refetchWinningTicket();
    }
  }, [isWeb3Enabled, account, lotteryNumber]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4">Last winning tickets!</h1>
      <div className="box-border w-96 h-300 rounded-lg p-4 border-2 bg-white">
        <div className="flex-col flex items-center">
          <div className="p-2">
            {lotteryNumber - 1 <= 0
              ? "No lottery yet"
              : "Lottery number " + (lotteryNumber - 1)}
          </div>
          <div className="font-bold text-2xl">
            {fetchingWinningTicket
              ? "Loading..."
              : listedWinningTicket.winningTicketLotteryPickeds.map(
                  (winningTicketLotteryPicked) => {
                    const { ticket } = winningTicketLotteryPicked;
                    return <div>{ticket}</div>;
                  }
                )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { TabList, Tab } from "web3uikit";
import { useBetween } from "use-between";
import { useLotteryV2 } from "../../../hooks/useLotteryV2";
import GET_PLAYER_EMIT_TICKETS_FOR_LOTTERY from "../../../subgraph/query-emit-tickets";
import GET_PLAYER_REVEAL_TICKETS_FOR_LOTTERY from "../../../subgraph/query-reveal-tickets";
import TicketsTable from "./TicketsTable";
import RevealButton from "./RevealButton";
import BuyTicketsButton from "./BuyTicketsButton";

export default function TicketsBox({ smartLotteryAddress, lotteryNumber }) {
  const { isWeb3Enabled, account } = useMoralis();
  const { fetchingTickets } = useBetween(useLotteryV2);
  const [loadTickets, setLoadTickets] = useState(true);

  const {
    loading: fetchingActualEmitTickets,
    data: listedActualEmitTickets,
    refetch: refetchActualEmitTickets,
  } = useQuery(GET_PLAYER_EMIT_TICKETS_FOR_LOTTERY, {
    variables: {
      player: account,
      lotteryNumber: lotteryNumber,
    },
  });

  const {
    loading: fetchingLastEmitTickets,
    data: listedLastlEmitTickets,
    refetch: refetchLastEmitTickets,
  } = useQuery(GET_PLAYER_EMIT_TICKETS_FOR_LOTTERY, {
    variables: {
      player: account,
      lotteryNumber: lotteryNumber - 1,
    },
  });

  const {
    loading: fetchingWinningTickets,
    data: listedWinningTickets,
    refetch: refetchWinningTickets,
  } = useQuery(GET_PLAYER_REVEAL_TICKETS_FOR_LOTTERY, {
    variables: {
      player: account,
      lotteryNumber: lotteryNumber - 1,
    },
  });

  async function updateUI() {
    setLoadTickets(true);
    await refetchActualEmitTickets();
    await refetchLastEmitTickets();
    await refetchWinningTickets();
    setLoadTickets(false);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account, lotteryNumber, fetchingTickets]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4">Your tickets!</h1>
      <div className="box-border w-96 h-600 rounded-lg p-4 border-2 bg-white">
        <TabList defaultActiveKey={0} tabStyle="bar">
          <Tab tabKey={0} tabName={"Actual lottery (" + lotteryNumber + ")"}>
            {loadTickets ? (
              "Loading..."
            ) : (
              <TicketsTable
                fetching={fetchingActualEmitTickets || fetchingWinningTickets}
                listedData={listedActualEmitTickets}
                customText="Buy your first ticket!"
              />
            )}
            <div className="p-3">
              <BuyTicketsButton smartLotteryAddress={smartLotteryAddress} />
            </div>
          </Tab>
          <Tab
            tabKey={1}
            tabName={"Last lottery (" + (lotteryNumber - 1) + ")"}
          >
            {loadTickets ? (
              "Loading..."
            ) : (
              <TicketsTable
                fetching={fetchingLastEmitTickets || fetchingWinningTickets}
                listedData={listedLastlEmitTickets}
                customText="No tickets for last lottery..."
                listedPreviousData={listedWinningTickets}
              />
            )}
            <div className="p-4">
              <RevealButton
                smartLotteryAddress={smartLotteryAddress}
                lotteryNumber={lotteryNumber - 1}
                fetching={fetchingLastEmitTickets}
                listedData={listedLastlEmitTickets}
              />
            </div>
          </Tab>
        </TabList>
      </div>
    </div>
  );
}

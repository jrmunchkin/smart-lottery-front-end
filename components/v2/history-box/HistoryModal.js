import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Modal, Input, Button } from "web3uikit";
import { useBetween } from "use-between";
import { useLotteryV2 } from "../../../hooks/useLotteryV2";
import GET_PLAYER_EMIT_TICKETS_FOR_LOTTERY from "../../../subgraph/query-emit-tickets";
import GET_PLAYER_REVEAL_TICKETS_FOR_LOTTERY from "../../../subgraph/query-reveal-tickets";
import GET_WINNING_TICKET_FOR_LOTTERY from "../../../subgraph/query-winning-ticket";
import TicketsTable from "../tickets-box/TicketsTable";
import RevealButton from "../tickets-box/RevealButton";

export default function HistoryModal({
  isVisible,
  onClose,
  smartLotteryAddress,
  previousLotteryNumber,
}) {
  const { fetchingTickets } = useBetween(useLotteryV2);
  const { isWeb3Enabled, account } = useMoralis();
  const [selectLotteryNumber, setSelectLotteryNumber] = useState(
    previousLotteryNumber
  );
  const [display, setDisplay] = useState(true);
  const [lotteryNumber, setLotteryNumber] = useState(previousLotteryNumber);
  const [loadTickets, setLoadTickets] = useState(true);

  const {
    loading: fetchingWinningTicket,
    data: listedWinningTicket,
    refetch: refetchWinningTicket,
  } = useQuery(GET_WINNING_TICKET_FOR_LOTTERY, {
    variables: {
      lotteryNumber: lotteryNumber,
    },
  });

  const {
    loading: fetchingEmitTickets,
    data: listedEmitTickets,
    refetch: refetchEmitTickets,
  } = useQuery(GET_PLAYER_EMIT_TICKETS_FOR_LOTTERY, {
    variables: {
      player: account,
      lotteryNumber: lotteryNumber,
    },
  });

  const {
    loading: fetchingRevealTickets,
    data: listedRevealTickets,
    refetch: refetchRevealTickets,
  } = useQuery(GET_PLAYER_REVEAL_TICKETS_FOR_LOTTERY, {
    variables: {
      player: account,
      lotteryNumber: lotteryNumber,
    },
  });

  async function seeLottery() {
    if (
      selectLotteryNumber > previousLotteryNumber + 1 ||
      selectLotteryNumber < 1
    ) {
      setDisplay(false);
    } else {
      setLotteryNumber(selectLotteryNumber);
      setDisplay(true);
    }
  }

  async function updateUI() {
    setLoadTickets(true);
    await seeLottery();
    await refetchEmitTickets();
    await refetchWinningTicket();
    await refetchRevealTickets();
    setLoadTickets(false);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account, fetchingTickets]);

  return (
    <Modal
      title={<div className="text-xl">Previous Lotteries</div>}
      isVisible={isVisible}
      onCloseButtonPressed={onClose}
      onCancel={onClose}
      onOk={onClose}
      okText="I'm done!"
    >
      <div className="flex items-center flex-col p-4">
        <h1>Enter a lottery number</h1>
        <div className="p-4 grid gap-4 grid-cols-2 grid-rows-1">
          <Input
            type="number"
            width="250px"
            value={selectLotteryNumber}
            onChange={(event) => {
              setSelectLotteryNumber(event.target.value);
            }}
          ></Input>
          <Button
            text="see lottery"
            size="large"
            theme="colored"
            color="yellow"
            onClick={async function () {
              await seeLottery();
            }}
          />
        </div>
        {!display ? (
          "Lottery data not available"
        ) : (
          <div>
            <div className="font-bold text-2xl">
              {fetchingWinningTicket
                ? "Loading..."
                : listedWinningTicket.winningTicketLotteryPickeds.map(
                    (winningTicketLotteryPicked) => {
                      const { ticket } = winningTicketLotteryPicked;
                      return <div>Winning ticket : {ticket}</div>;
                    }
                  )}
            </div>
            <div className="p-4">
              {loadTickets ? (
                "Loading..."
              ) : (
                <TicketsTable
                  fetching={fetchingEmitTickets || fetchingRevealTickets}
                  listedData={listedEmitTickets}
                  customText="No tickets for this lottery..."
                  listedPreviousData={listedRevealTickets}
                />
              )}
            </div>
            <RevealButton
              smartLotteryAddress={smartLotteryAddress}
              lotteryNumber={lotteryNumber}
              fetching={fetchingEmitTickets}
              listedData={listedEmitTickets}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

import { Table, Tag } from "web3uikit";

export default function TicketsTable({
  fetching,
  customText,
  listedData,
  listedPreviousData,
}) {
  function updateTickets() {
    let data = [];
    if (
      listedPreviousData != undefined &&
      listedPreviousData.revealTickets.length > 0
    ) {
      listedPreviousData.revealTickets.map((winningTicketPlayer) => {
        const { ticket, nbMatching } = winningTicketPlayer;
        data.push([
          ticket,
          nbMatching,
          nbMatching > 0 ? (
            <Tag color="green" text="Winning!" />
          ) : (
            <Tag color="red" text="Losing..." />
          ),
        ]);
      });
    } else {
      listedData.emitTickets.map((emitTicket) => {
        const { ticket } = emitTicket;
        data.push([ticket, 0, <Tag color="yellow" text="Pending" />]);
      });
    }

    return data;
  }

  return (
    <div className="flex-col flex items-center">
      <div className="flex-col flex">
        {fetching ? (
          "Loading..."
        ) : (
          <Table
            columnsConfig="100px 100px 100px"
            customNoDataText={customText}
            isLoading={fetching}
            data={updateTickets}
            header={[
              <span>Ticket</span>,
              <span>Matching</span>,
              <span>Is Winning?</span>,
            ]}
            isColumnSortable={[false, true, true]}
            pageSize={4}
            maxPages={3}
          ></Table>
        )}
      </div>
    </div>
  );
}

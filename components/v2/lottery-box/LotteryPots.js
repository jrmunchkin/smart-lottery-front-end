import { Accordion, Table } from "web3uikit";

export default function LotteryPots({
  prizeDistribution,
  lotteryBalance,
  nbPlayers,
}) {
  return (
    <div className="w-72 lg:w-360">
      {prizeDistribution.length == 0 ? (
        "Loading..."
      ) : (
        <Accordion
          id="pots"
          subTitle={lotteryBalance + " ETH"}
          tagText={nbPlayers + " players"}
        >
          <Table
            columnsConfig="180px 140px"
            isLoading={prizeDistribution.length == 0}
            data={[
              [
                "4 Matching",
                Math.round(
                  ((prizeDistribution[3].toNumber() * lotteryBalance) / 100) *
                    1e5
                ) / 1e5,
              ],
              [
                "3 Matching",
                Math.round(
                  ((prizeDistribution[2].toNumber() * lotteryBalance) / 100) *
                    1e5
                ) / 1e5,
              ],
              [
                "2 Matching",
                Math.round(
                  ((prizeDistribution[1].toNumber() * lotteryBalance) / 100) *
                    1e5
                ) / 1e5,
              ],
              [
                "1 Matching",
                Math.round(
                  ((prizeDistribution[0].toNumber() * lotteryBalance) / 100) *
                    1e5
                ) / 1e5,
              ],
            ]}
            header={[<span>Pot</span>, <span>Size</span>]}
            isColumnSortable={[false, false]}
            noPagination
          ></Table>
        </Accordion>
      )}
    </div>
  );
}

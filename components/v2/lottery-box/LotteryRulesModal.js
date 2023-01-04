import { Modal } from "web3uikit";

export default function LotteryRulesModal({
  isVisible,
  onClose,
  prizeDistribution,
}) {
  return (
    <Modal
      title={<div className="text-xl">Lottery Rules</div>}
      isVisible={isVisible}
      onCloseButtonPressed={onClose}
      onCancel={onClose}
      onOk={onClose}
      okText="I get it!"
    >
      {prizeDistribution.length == 0 ? (
        "Loading..."
      ) : (
        <ul className="p-4 text-left list-disc">
          <li>
            To play the lottery, you must buy tickets (max buying tickets : 10).
          </li>
          <li>Everytime you buy a ticket you get 4 random numbers.</li>
          <li>The lottery balance is divided into 4 pots.</li>
          <li>
            If you get a ticket with the first number matching the winning
            ticket, you win the smallest pot ({prizeDistribution[0].toNumber()}
            %).
          </li>
          <li>
            If you get a ticket with the two first number matching the winning
            ticket, you win the second pot ({prizeDistribution[1].toNumber()}
            %).
          </li>
          <li>
            If you get a ticket with the third first number matching the winning
            ticket, you win the third pot ({prizeDistribution[2].toNumber()}
            %).
          </li>
          <li>
            If you get a ticket with the fourth number matching the winning
            ticket, you win the biggest pot ({prizeDistribution[3].toNumber()}
            %).
          </li>
          <li>Each pot is also divided by the number of user who win it.</li>
        </ul>
      )}
    </Modal>
  );
}

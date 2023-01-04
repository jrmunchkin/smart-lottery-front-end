import { useState } from "react";
import { Button } from "web3uikit";
import HistoryModal from "./HistoryModal";

export default function HistoryBox({ smartLotteryAddress, lotteryNumber }) {
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4">Check at the last lotteries!</h1>
      <div className="box-border w-96 h-300 rounded-lg p-4 border-2 bg-white">
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center gap-2">
            Check if you have winning tickets on previous lotteries
          </div>
          <div className="p-4">
            <HistoryModal
              isVisible={showModal}
              onClose={hideModal}
              smartLotteryAddress={smartLotteryAddress}
              previousLotteryNumber={lotteryNumber - 2}
            />
            <Button
              text="See last lotteries"
              size="large"
              theme="colored"
              color="yellow"
              onClick={() => {
                setShowModal(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

export const useLottery = () => {
  const [isLotteryChange, setIsLotteryChange] = useState(false);
  const [lotteryNumber, setLotteryNumber] = useState(0);

  return {
    isLotteryChange,
    setIsLotteryChange,
    lotteryNumber,
    setLotteryNumber,
  };
};

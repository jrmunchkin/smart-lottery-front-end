import { useState } from "react";

export const useLotteryV2 = () => {
  const [fetchingTickets, setFetchingTickets] = useState(0);
  const [isLotteryChange, setIsLotteryChange] = useState(false);
  const [lotteryIsCalculating, setLotteryIsCalculating] = useState(false);

  return {
    fetchingTickets,
    setFetchingTickets,
    isLotteryChange,
    setIsLotteryChange,
    lotteryIsCalculating,
    setLotteryIsCalculating,
  };
};

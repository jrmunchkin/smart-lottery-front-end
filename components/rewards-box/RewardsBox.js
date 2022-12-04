import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { Button, useNotification } from "web3uikit";
import { useBetween } from "use-between";
import { useLottery } from "../../hooks/useLottery";
import smartLotteryAbi from "../../constants/smartLottery.json";

export default function RewardsBox({ smartLotteryAddress }) {
  const { isLotteryChange, setIsLotteryChange } = useBetween(useLottery);
  const { isWeb3Enabled, account } = useMoralis();
  const [userRewards, setUserRewards] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: getUserRewardsBalance } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "getUserRewardsBalance",
    params: {
      _user: account,
    },
  });

  const {
    runContractFunction: claimRewards,
    isLoading: isLoading,
    isFetching: isFetching,
  } = useWeb3Contract({
    abi: smartLotteryAbi,
    contractAddress: smartLotteryAddress,
    functionName: "claimRewards",
    params: {},
  });

  async function updateUI() {
    const userRewardsFromCall = (await getUserRewardsBalance()).toString();
    const formattedUserRewardsBalance = userRewardsFromCall
      ? Math.round(
          (parseFloat(formatUnits(userRewardsFromCall, 18)) + Number.EPSILON) *
            1e5
        ) / 1e5
      : 0;
    setUserRewards(formattedUserRewardsBalance);
  }

  const handleClaimRewardsSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your rewards have been claimed!",
      title: "Rewards claimed!",
      position: "topR",
    });
    updateUI();
  };

  const handleClaimRewardsError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure you have rewards to claim?";
    dispatch({
      type: "error",
      message: message,
      title: "Error claiming rewards!",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
      setIsLotteryChange(false);
    }
  }, [isWeb3Enabled, account, isLotteryChange]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4">
        Claim your rewards from lottery!
      </h1>
      <div className="box-border w-96 h-40 rounded-lg border-2 bg-white">
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center gap-2">
            <div className="font-bold text-2xl">{userRewards}</div>
            <img className="w-10" src="/images/eth.png" alt="eth logo"></img>
          </div>
          <div className="p-4">
            <Button
              text="Claim Rewards!"
              size="xl"
              theme="colored"
              color="green"
              onClick={async function () {
                await claimRewards({
                  onError: handleClaimRewardsError,
                  onSuccess: handleClaimRewardsSuccess,
                });
              }}
              disabled={isLoading || isFetching}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

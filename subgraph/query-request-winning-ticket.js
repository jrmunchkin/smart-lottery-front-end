import { gql } from "@apollo/client";

const GET_REQUEST_WINNING_TICKET_FOR_LOTTERY = gql`
  query ($lotteryNumber: BigInt!) {
    requestLotteryWinningTickets(
      first: 1
      where: { lotteryNumber: $lotteryNumber }
    ) {
      id
      lotteryNumber
      requestId
    }
  }
`;

export default GET_REQUEST_WINNING_TICKET_FOR_LOTTERY;

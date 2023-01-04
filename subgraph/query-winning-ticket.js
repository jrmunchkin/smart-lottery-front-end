import { gql } from "@apollo/client";

const GET_WINNING_TICKET_FOR_LOTTERY = gql`
  query ($lotteryNumber: BigInt!) {
    winningTicketLotteryPickeds(
      first: 1
      where: { lotteryNumber: $lotteryNumber }
    ) {
      id
      lotteryNumber
      ticket
    }
  }
`;

export default GET_WINNING_TICKET_FOR_LOTTERY;

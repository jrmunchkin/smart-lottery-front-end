import { gql } from "@apollo/client";

const GET_PLAYER_EMIT_TICKETS_FOR_LOTTERY = gql`
  query ($player: Bytes!, $lotteryNumber: BigInt!) {
    emitTickets(
      first: 10
      where: { player: $player, lotteryNumber: $lotteryNumber }
    ) {
      id
      lotteryNumber
      player
      ticket
    }
  }
`;

export default GET_PLAYER_EMIT_TICKETS_FOR_LOTTERY;

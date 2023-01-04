import { gql } from "@apollo/client";

const GET_PLAYER_REVEAL_TICKETS_FOR_LOTTERY = gql`
  query ($player: Bytes!, $lotteryNumber: BigInt!) {
    revealTickets(
      first: 10
      where: { player: $player, lotteryNumber: $lotteryNumber }
      orderBy: nbMatching
      orderDirection: desc
    ) {
      id
      lotteryNumber
      player
      nbMatching
      ticket
    }
  }
`;

export default GET_PLAYER_REVEAL_TICKETS_FOR_LOTTERY;

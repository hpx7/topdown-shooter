import { useInterval } from "use-interval";
import React from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

import { ClockIcon, TrophyIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";

import { LobbyState } from "../../../common/types";
import { Region } from "../../../common/lobby-service/Region";
import { PlayerLobbyClient } from "../../../common/lobby-service/PlayerLobbyClient";
import { Lobby } from "../../../common/lobby-service/Lobby";

import { LobbyPageCard } from "./LobbyPageCard";
import { BulletButton } from "./BulletButton";
interface PublicLobbyListProps {
  lobbyClient: PlayerLobbyClient<LobbyState>;
  joinLobby: (roomId: string) => void;
}

export function PublicLobbyList(props: PublicLobbyListProps) {
  const { lobbyClient, joinLobby } = props;
  const lobbies = useLobbies(lobbyClient);
  return (
    <LobbyPageCard>
      <Header text="Join Public Lobby" className="mt-4 mb-2" />
      <table className="w-full mb-4 border border-secondary-700 rounded-sm">
        <tbody>
          <tr className="bg-secondary-500 text-secondary-800">
            <th className="py-1 text-sm font-medium border border-secondary-700">Room ID</th>
            <th className="py-1 text-sm font-medium border border-secondary-700">Spots</th>
            <th colSpan={2} className="py-1 text-sm font-medium border border-secondary-700">
              Details
            </th>
            <th colSpan={1} className="py-1 text-sm font-medium border border-secondary-700"></th>
          </tr>
          {lobbies.map((lobby, index) => (
            <tr
              key={`lobby_${lobby.createdBy}_${lobby.createdAt}`}
              className={`text-secondary-900 ${index % 2 === 0 ? "bg-secondary-600" : ""}`}
            >
              <td
                className={`border-r ${index % 2 === 0 ? "border-secondary-400" : "border-secondary-600"}`}
              >{`${lobby.roomId}`}</td>
              <td className={`border-r ${index % 2 === 0 ? "border-secondary-400" : "border-secondary-600"}`}>
                <div className={"flex items-center justify-center gap-1"}>
                  <UsersIcon className="h-4 w-4 text-secondary-700" />
                  {`${lobby.state?.players.length ?? 0}/${lobby.capacity ?? 0}`}
                </div>
              </td>
              <td className={"flex justify-center px-1 py-1 text-sm"}>
                <div className={"grid grid-cols-2 grid-rows-2 gap-x-2"}>
                  <div className={"flex"}>{`${FLAG_TABLE[lobby.region]} ${lobby.region}`}</div>
                  <div className={"flex items-center gap-1"}>
                    <ClockIcon className="h-4 w-4 text-secondary-700" />
                    {`${dayjs(lobby.createdAt).fromNow()}`}
                  </div>
                  <div className={"flex items-center"}>
                    <UserIcon className="h-4 w-4 text-secondary-700" />
                    {lobby.createdBy}
                  </div>
                  <div className={"flex items-center gap-1"}>
                    <TrophyIcon className="h-4 w-4 text-secondary-700" />
                    {`${lobby.state?.killsToWin ?? 0} kills to win`}
                  </div>
                </div>
              </td>
              <td className={`border-r ${index % 2 === 0 ? "border-secondary-400" : "border-secondary-600"}`}></td>
              <td>
                <button onClick={() => joinLobby(lobby.roomId)}>
                  <BulletButton text={"JOIN!"}></BulletButton>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </LobbyPageCard>
  );
}

function useLobbies(lobbyClient: PlayerLobbyClient<LobbyState>): Lobby<LobbyState>[] {
  const [lobbies, setLobbies] = React.useState<Lobby<LobbyState>[]>([]);
  React.useEffect(() => {
    lobbyClient.listActivePublicLobbiesV2().then(setLobbies);
  }, [lobbyClient]);
  useInterval(() => {
    lobbyClient.listActivePublicLobbiesV2().then(setLobbies);
  }, 2000);
  return lobbies;
}

function Header(props: { text: string; className: string }) {
  return <h1 className={"text-2xl font-semibold uppercase text-brand-500 " + props.className}>{props.text}</h1>;
}

const FLAG_TABLE: Record<Region, string> = {
  Seattle: "🇺🇸",
  Chicago: "🇺🇸",
  London: "🇬🇧",
  Frankfurt: "🇩🇪",
  Mumbai: "🇮🇳",
  Singapore: "🇸🇬",
  Tokyo: "🇯🇵",
  Sydney: "🇦🇺",
  Washington_DC: "🇺🇸",
  Sao_Paulo: "🇧🇷",
};

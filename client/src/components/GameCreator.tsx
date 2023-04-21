import React from "react";
import { GoogleLogin } from "@react-oauth/google";

import { GoogleToken, LOCAL_CONNECTION_DETAILS, Token } from "../utils";
import { InitialConfig, LobbyState } from "../../../common/types";
import { Region } from "../../../common/lobby-service/Region";
import { PlayerLobbyClient } from "../../../common/lobby-service/PlayerLobbyClient";
import { Lobby } from "../../../common/lobby-service/Lobby";

import { MultiSelect } from "./MultiSelect";
import { LobbyPageCard } from "./LobbyPageCard";
import { Header } from "./Header";
import { Dropdown } from "./Dropdown";
import { BulletButton } from "./BulletButton";

interface GameCreatorProps {
  lobbyClient: PlayerLobbyClient<LobbyState, InitialConfig>;
  playerToken: Token;
  setGoogleIdToken: (idToken: string) => void;
}
export function GameCreator(props: GameCreatorProps) {
  const { lobbyClient, playerToken, setGoogleIdToken } = props;
  const [visibility, setVisibility] = React.useState<"Public" | "Private" | "Local">("Public");
  const [region, setRegion] = React.useState<Region>(Region.Chicago);
  const [capacity, setCapacity] = React.useState<number>(6);
  const [winningScore, setWinningScore] = React.useState<number>(20);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const initialConfig: InitialConfig = { capacity, winningScore };
  return (
    <LobbyPageCard>
      <Header className="mt-4 mb-2">Create Game</Header>
      <MultiSelect
        className="mb-3"
        options={import.meta.env.DEV ? ["Public", "Private", "Local"] : ["Public", "Private"]}
        selected={visibility}
        onSelect={setVisibility}
      />
      <Dropdown className="mb-3" width="w-56" options={Object.values(Region)} selected={region} onSelect={setRegion} />
      <Dropdown
        className="mb-3"
        width="w-56"
        options={[1, 2, 3, 4, 5, 6, 7]}
        format={(s) => `${s} players`}
        selected={capacity}
        onSelect={(s) => setCapacity(Number(s))}
      />
      <Dropdown
        className="mb-3"
        width="w-56"
        options={[5, 10, 15, 20, 25]}
        format={(s) => `${s} kills to win`}
        selected={winningScore}
        onSelect={(s) => setWinningScore(Number(s))}
      />
      <div className={"mb-3 flex items-center justify-center"}>
        {!Token.isGoogleToken(playerToken) ? (
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              credentialResponse.credential != null
                ? setGoogleIdToken(credentialResponse.credential)
                : console.error("invalid response from Google Oauth")
            }
          />
        ) : (
          <button
            onClick={async () => {
              if (!isLoading) {
                setIsLoading(true);
                try {
                  const lobby = await createLobby(lobbyClient, playerToken, region, initialConfig, visibility);
                  // Wait until lobby connection details are ready before redirect player to match
                  await lobbyClient.getConnectionDetailsForLobby(lobby.roomId, LOCAL_CONNECTION_DETAILS);
                  window.location.href = `/${lobby.roomId}`; //update url
                } catch (e) {
                  setError(e instanceof Error ? e.toString() : typeof e === "string" ? e : "Unknown error");
                } finally {
                  setIsLoading(false);
                }
              }
            }}
          >
            <BulletButton text={"CREATE!"} disabled={isLoading} large />
          </button>
        )}
        {isLoading && (
          <div className={"absolute ml-40 text-brand-500 inline-flex items-center loading-dots-animation"}>
            Starting...
          </div>
        )}
      </div>
      {error && <div className={"mb-3 text-brand-500 text-xs"}>{error}</div>}
    </LobbyPageCard>
  );
}

function createLobby(
  lobbyClient: PlayerLobbyClient<LobbyState, InitialConfig>,
  playerToken: GoogleToken,
  region: Region,
  initialConfig: InitialConfig,
  visibility: "Public" | "Private" | "Local"
): Promise<Lobby<LobbyState, InitialConfig>> {
  switch (visibility) {
    case "Public":
      return lobbyClient.createPublicLobby(playerToken.value, region, initialConfig);
    case "Private":
      return lobbyClient.createPrivateLobby(playerToken.value, region, initialConfig);
    case "Local":
      return lobbyClient.createLocalLobby(playerToken.value, region, initialConfig);
  }
}

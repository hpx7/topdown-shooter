import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import * as errors from "@hathora/cloud-sdk-typescript/models/errors";
import { LobbyVisibility, Region } from "@hathora/cloud-sdk-typescript/models/components";

import { getHathoraSdk, isReadyForConnect, Token } from "../../utils";
import { RoomConfig } from "../../../../common/types";

import { MultiSelect } from "./MultiSelect";
import { LobbyPageCard } from "./LobbyPageCard";
import { Header } from "./Header";
import { Dropdown } from "./Dropdown";
import { BulletButton } from "./BulletButton";

interface GameCreatorProps {
  appId: string;
  playerToken: Token;
  setGoogleIdToken: (idToken: string) => void;
}
export function GameCreator(props: GameCreatorProps) {
  const { appId, playerToken, setGoogleIdToken } = props;
  const [visibility, setVisibility] = React.useState<"public" | "private" | "local">("public");
  const [region, setRegion] = React.useState<Region>(Region.Chicago);
  const [capacity, setCapacity] = React.useState<number>(6);
  const [winningScore, setWinningScore] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const hathoraSdk = getHathoraSdk(appId);

  return (
    <LobbyPageCard className={"pb-1.5"}>
      <Header className="mt-4 mb-2">Create Game</Header>
      <MultiSelect
        className="mb-2"
        options={import.meta.env.DEV ? ["public", "private", "local"] : ["public", "private"]}
        selected={visibility}
        onSelect={setVisibility}
      />
      <Dropdown className="mb-2" width="w-56" options={Object.values(Region)} selected={region} onSelect={setRegion} />
      <Dropdown
        className="mb-2"
        width="w-56"
        options={[1, 2, 3, 4, 5, 6, 7]}
        format={(s) => `${s} players`}
        selected={capacity}
        onSelect={(s) => setCapacity(Number(s))}
      />
      <Dropdown
        className="mb-2"
        width="w-56"
        options={[5, 10, 15, 20, 25]}
        format={(s) => `${s} kills to win`}
        selected={winningScore}
        onSelect={(s) => setWinningScore(Number(s))}
      />
      <div className={"flex flex-col items-center"}>
        <div className={"mb-2 flex items-center justify-center"}>
          {!Token.isGoogleToken(playerToken) && (
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                credentialResponse.credential != null
                  ? setGoogleIdToken(credentialResponse.credential)
                  : console.error("invalid response from Google Oauth")
              }
            />
          )}
        </div>
        <div className={"relative"}>
          <button
            onClick={async () => {
              if (!isLoading) {
                setError("");
                if (!Token.isGoogleToken(playerToken) && visibility !== "local") {
                  setError("Google sign-in is required to create a match");
                  return;
                }
                setIsLoading(true);
                try {
                  const roomConfig: RoomConfig = {
                    capacity,
                    winningScore,
                    playerNicknameMap: {},
                    isGameEnd: false,
                  };
                  const lobbyV3 = await hathoraSdk.lobbiesV3.createLobby(
                    { playerAuth: playerToken.value },
                    {
                      region,
                      visibility: visibility as LobbyVisibility,
                      roomConfig: JSON.stringify(roomConfig),
                    },
                  );
                  // Wait until lobby connection details are ready before redirect player to match
                  await isReadyForConnect(appId, lobbyV3.roomId, hathoraSdk);
                  window.location.href = `/${lobbyV3.roomId}`; //update url
                } catch (err) {
                  switch (true) {
                    case err instanceof errors.ApiError: {
                      console.error(err); // handle exception
                      throw new Error("Failed to create lobby");
                    }
                    default: {
                      setError(err instanceof Error ? err.toString() : typeof err === "string" ? err : "Unknown error");
                    }
                  }
                } finally {
                  setIsLoading(false);
                }
              }
            }}
          >
            <BulletButton text={"CREATE!"} disabled={isLoading} large />
          </button>
          {isLoading && (
            <div className={"absolute left-[6.6rem] top-[0.28rem] text-brand-500 loading-dots-animation"}>
              Starting...
            </div>
          )}
        </div>
      </div>
      {error && <div className={"-mt-1 text-brand-500 text-xs"}>{error}</div>}
    </LobbyPageCard>
  );
}

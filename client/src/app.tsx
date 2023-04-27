import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HathoraConnection } from "@hathora/client-sdk";

import { SessionMetadata, InitialConfig, LobbyState } from "../../common/types";
import { PlayerLobbyClient } from "../../common/lobby-service/PlayerLobbyClient";
import { AuthClient } from "../../common/lobby-service/AuthClient";

import { LOCAL_CONNECTION_DETAILS, Token } from "./utils";
import { Socials } from "./components/website/Socials";
import { HathoraLogo } from "./components/website/HathoraLogo";
import { Footer } from "./components/website/Footer";
import { ExplanationText, NavLink } from "./components/website/ExplanationText";
import { NicknameScreen } from "./components/lobby/NicknameScreen";
import { LobbySelector } from "./components/lobby/LobbySelector";
import { BulletButton } from "./components/lobby/BulletButton";
import { GameComponent, GameConfig } from "./components/GameComponent";

function App() {
  const appId = process.env.HATHORA_APP_ID;
  const [googleIdToken, setGoogleIdToken] = useState<string | undefined>();
  const token = useAuthToken(appId, googleIdToken);
  const [connection, setConnection] = useState<HathoraConnection | undefined>();
  const [sessionMetadata, setSessionMetadata] = useState<SessionMetadata | undefined>(undefined);
  const [failedToConnect, setFailedToConnect] = useState(false);
  const [roomIdNotFound, setRoomIdNotFound] = useState<string | undefined>(undefined);
  const [isNicknameAcked, setIsNicknameAcked] = React.useState<boolean>(false);

  if (appId == null || token == null) {
    return <div>Loading...</div>;
  }
  const lobbyClient = new PlayerLobbyClient<LobbyState, InitialConfig>(appId);
  const roomIdFromUrl = getRoomIdFromUrl();
  if (
    roomIdFromUrl != null &&
    sessionMetadata?.roomId != roomIdFromUrl &&
    roomIdNotFound == null &&
    !failedToConnect &&
    !sessionMetadata?.isGameEnd
  ) {
    // Once we parse roomId from the URL, get connection details to connect player to the server
    lobbyClient
      .getConnectionDetailsForLobby(roomIdFromUrl, LOCAL_CONNECTION_DETAILS)
      .then(async (connectionDetails) => {
        setRoomIdNotFound(undefined);
        if (connection != null) {
          connection.disconnect(1000);
        }

        try {
          const lobbyInfo = await lobbyClient.getLobbyInfo(roomIdFromUrl);

          if (!lobbyInfo.state?.isGameEnd) {
            const connect = new HathoraConnection(roomIdFromUrl, connectionDetails);
            connect.onClose(async () => {
              // If game has ended, we want updated lobby state
              const updatedLobbyInfo = await lobbyClient.getLobbyInfo(roomIdFromUrl);
              setSessionMetadata({
                serverUrl: `${connectionDetails.host}:${connectionDetails.port}`,
                region: updatedLobbyInfo.region,
                roomId: updatedLobbyInfo.roomId,
                capacity: updatedLobbyInfo.initialConfig.capacity,
                winningScore: updatedLobbyInfo.initialConfig.winningScore,
                isGameEnd: !!updatedLobbyInfo.state?.isGameEnd,
                winningPlayerId: updatedLobbyInfo.state?.winningPlayerId,
                playerNicknameMap: updatedLobbyInfo.state?.playerNicknameMap ?? {},
                creatorId: updatedLobbyInfo.createdBy,
              });
              setFailedToConnect(true);
            });
            setConnection(connect);
          }
          setSessionMetadata({
            serverUrl: `${connectionDetails.host}:${connectionDetails.port}`,
            region: lobbyInfo.region,
            roomId: lobbyInfo.roomId,
            capacity: lobbyInfo.initialConfig.capacity,
            winningScore: lobbyInfo.initialConfig.winningScore,
            isGameEnd: lobbyInfo.state?.isGameEnd ?? false,
            winningPlayerId: lobbyInfo.state?.winningPlayerId,
            playerNicknameMap: lobbyInfo.state?.playerNicknameMap ?? {},
            creatorId: lobbyInfo.createdBy,
          });
        } catch (e) {
          setRoomIdNotFound(roomIdFromUrl);
        }
      })
      .catch(() => {
        setRoomIdNotFound(roomIdFromUrl);
      });
  }
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_AUTH_CLIENT_ID ?? ""}>
      <div className="py-5 overflow-hidden" style={{ backgroundColor: "#0E0E1B" }}>
        <div className="md:w-fit mx-auto px-2 md:px-0">
          <div className={"flex justify-center items-center"}>
            <div className={"flex justify-center items-center md:items-end"}>
              <a href="https://hathora.dev" className={"w-[150px] md:w-[207px]"}>
                <HathoraLogo />
              </a>
              <div className={"mx-3 text-hathoraSecondary-400 text-xs md:text-lg text-baseline"}>PRESENTS</div>
            </div>
            <div className={""}>
              <img src="bullet_mania_logo_light.png" className="h-[40px] md:h-[60px]" alt="logo" />
            </div>
          </div>
          <p className={"visible md:hidden text-neutralgray-400 text-center mt-3"}>
            Bullet Mania isn't currently playable on mobile <br />
            <NavLink headingId={"docsTop"}>Skip to documentation</NavLink>
          </p>
          <div className={"md:mt-4"} style={{ width: GameConfig.width, height: GameConfig.height }}>
            {failedToConnect ? (
              <div className="border text-white flex flex-wrap flex-col justify-center h-full w-full content-center text-secondary-400 text-center">
                Connection was closed
                <br />
                {sessionMetadata?.isGameEnd ? (
                  <>
                    <div className={"text-secondary-600"}>Game has ended</div>
                    <div className={"text-secondary-600"}>
                      {`${
                        sessionMetadata.playerNicknameMap[sessionMetadata.winningPlayerId ?? ""] ??
                        sessionMetadata.winningPlayerId
                      } won!`}
                    </div>
                  </>
                ) : (
                  <span className={"text-secondary-600"}>Game is full</span>
                )}
                <br />
                <a href={"/"} className={"mt-2"}>
                  <BulletButton text={"Return to Lobby"} xlarge />
                </a>
              </div>
            ) : (
              <>
                {connection == null && !sessionMetadata?.isGameEnd && !roomIdFromUrl ? (
                  <LobbySelector
                    lobbyClient={lobbyClient}
                    playerToken={token}
                    roomIdNotFound={roomIdNotFound}
                    setGoogleIdToken={setGoogleIdToken}
                  />
                ) : !isNicknameAcked && !sessionMetadata?.isGameEnd ? (
                  <NicknameScreen sessionMetadata={sessionMetadata} setIsNicknameAcked={setIsNicknameAcked} />
                ) : (
                  <></>
                )}
                <GameComponent
                  connection={connection}
                  token={token}
                  sessionMetadata={sessionMetadata}
                  isNicknameAcked={isNicknameAcked}
                />
              </>
            )}
          </div>
          <Socials roomId={sessionMetadata?.roomId} />
          <ExplanationText />
        </div>
      </div>
      <Footer />
    </GoogleOAuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

function useAuthToken(appId: string | undefined, googleIdToken: string | undefined): Token | undefined {
  const [token, setToken] = React.useState<Token | undefined>();
  useEffect(() => {
    if (appId != null) {
      const authClient = new AuthClient(appId);
      getToken(authClient, googleIdToken).then(setToken);
    }
  }, [appId, googleIdToken]);
  return token;
}

// The getToken function first checks sessionStorage to see if there is an existing token, and if there is returns it. If not, it logs the user into a new session and updates the sessionStorage key.
async function getToken(client: AuthClient, googleIdToken: string | undefined): Promise<Token> {
  const maybeToken = sessionStorage.getItem("bullet-mania-token");
  const maybeTokenType = sessionStorage.getItem("bullet-mania-token-type");
  if (maybeToken !== null && maybeTokenType != null) {
    return {
      type: maybeTokenType,
      value: maybeToken,
    } as Token;
  }
  if (googleIdToken == null) {
    const token = await client.loginAnonymous();
    return { value: token, type: "anonymous" };
  }
  const token = await client.loginGoogle(googleIdToken);
  sessionStorage.setItem("bullet-mania-token", token);
  sessionStorage.setItem("bullet-mania-token-type", "google");
  return { value: token, type: "google" };
}

function getRoomIdFromUrl(): string | undefined {
  if (location.pathname.length > 1) {
    return location.pathname.split("/").pop();
  }
}

import { LobbyV3, TransportType } from "@hathora/cloud-sdk-typescript/models/components";
import { HathoraCloud } from "@hathora/cloud-sdk-typescript";
import { ConnectionDetails } from "@hathora/client-sdk";

export const LOCAL_CONNECTION_DETAILS: ConnectionDetails = {
  host: "localhost",
  port: 4000,
  transportType: "tcp" as const,
};

export type Token = GoogleToken | AnonymousToken;

export interface GoogleToken {
  type: "google";
  value: string;
}
interface AnonymousToken {
  type: "anonymous";
  value: string;
}

export const Token = {
  isGoogleToken(token: Token): token is GoogleToken {
    return token.type === "google";
  },
  isAnonymousToken(token: Token): token is AnonymousToken {
    return token.type === "anonymous";
  },
};

export async function isReadyForConnect(
  appId: string,
  roomId: string,
  hathoraSdk: HathoraCloud,
): Promise<{ lobbyInfo: LobbyV3; connectionInfo: ConnectionDetails }> {
  const MAX_CONNECT_ATTEMPTS = 50;
  const TRY_CONNECT_INTERVAL_MS = 1000;

  try {
    const lobbyInfo = await hathoraSdk.lobbiesV3.getLobbyInfoByRoomId(roomId);
    if (lobbyInfo.visibility === "local") {
      return new Promise<{ lobbyInfo: LobbyV3; connectionInfo: ConnectionDetails }>((resolve) =>
        resolve({ lobbyInfo, connectionInfo: LOCAL_CONNECTION_DETAILS }),
      );
    }

    for (let i = 0; i < MAX_CONNECT_ATTEMPTS; i++) {
      const connectionInfoV2 = await hathoraSdk.roomsV2.getConnectionInfo(roomId);
      if (connectionInfoV2.exposedPort !== undefined) {
        return {
          lobbyInfo,
          connectionInfo: {
            ...connectionInfoV2.exposedPort,
            transportType: isRecognized(TransportType, connectionInfoV2.exposedPort.transportType)
              ? connectionInfoV2.exposedPort.transportType
              : "tcp",
          },
        };
      }
      await new Promise((resolve) => setTimeout(resolve, TRY_CONNECT_INTERVAL_MS));
    }
  } catch (err) {
    throw new Error("Lobby not found: " + roomId);
  }
  throw new Error("Polling timed out");
}

export function getHathoraSdk(appId: string | undefined): HathoraCloud {
  return new HathoraCloud({ appId });
}

function isRecognized<U>(mapping: { [k: string]: U }, candidate: unknown): candidate is U {
  for (const [, member] of Object.entries(mapping)) {
    if (member === candidate) {
      return true;
    }
  }
  return false;
}

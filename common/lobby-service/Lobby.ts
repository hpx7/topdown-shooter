import { Region } from './Region';

export interface Lobby<LobbyState extends object = object> {
  state?: LobbyState;
  createdAt: Date;
  createdBy: string;
  local: boolean;
  visibility: 'public' | 'private';
  region: Region;
  roomId: string;
  appId: string;
}
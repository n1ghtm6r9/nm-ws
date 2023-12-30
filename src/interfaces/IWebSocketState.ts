import type { WebSocket } from 'ws';
import { ICallbackInfo } from './ICallbackInfo';

export interface IWebSocketState {
  clientId: string;
  client: WebSocket;
  callbacks: ICallbackInfo[];
  reconnectTimeoutId?: NodeJS.Timeout | string | number;
  callGetUrlIntervalId?: NodeJS.Timeout | string | number;
}

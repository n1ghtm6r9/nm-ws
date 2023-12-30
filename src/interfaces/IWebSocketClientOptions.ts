import type { WebSocket } from 'ws';
import { IWebSocketClientPingStrategyResult } from './IWebSocketClientPingStrategyResult';

export interface IWebSocketClientOptions {
  getUrl: () => string | Promise<string>;
  pingStrategy?: (client: WebSocket) => IWebSocketClientPingStrategyResult;
  tryReconnectCountLimit?: number;
  pingIntervalMs?: number;
  networkDelayLimitMs?: number;
  reconnectAfterMs?: number;
  callGetUrlIntervalMs?: number;
}

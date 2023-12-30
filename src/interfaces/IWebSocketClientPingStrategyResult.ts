import { FunctionType } from '@nmxjs/types';

export interface IWebSocketClientPingStrategyResult {
  ping: () => void;
  pong: (cb: FunctionType) => void;
}

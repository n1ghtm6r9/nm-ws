import { IWebSocketClientOptions } from './IWebSocketClientOptions';

export interface IReconnectWebSocketClientServiceOptions {
  stateId: string;
  clientOptions: IWebSocketClientOptions;
}

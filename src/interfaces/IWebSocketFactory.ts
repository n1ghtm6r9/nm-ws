import { IWebSocketClient } from './IWebSocketClient';
import { IWebSocketClientOptions } from './IWebSocketClientOptions';

export interface IWebSocketFactory<T = any> {
  create(options: IWebSocketClientOptions): IWebSocketClient<T>;
}

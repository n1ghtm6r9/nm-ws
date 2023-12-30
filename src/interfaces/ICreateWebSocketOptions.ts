import { IWebSocketClientOptions } from './IWebSocketClientOptions';

export interface ICreateWebSocketOptions extends Pick<IWebSocketClientOptions, 'getUrl' | 'tryReconnectCountLimit'> {}

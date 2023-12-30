import type { WebSocket } from 'ws';
import { IAddListenerOptions } from './IAddListenerOptions';
import { IAddListenerResult } from './IAddListenerResult';
import { IRemoveListenerOptions } from './IRemoveListenerOptions';
import { IRemoveListenerResult } from './IRemoveListenerResult';

export interface IWebSocketClient<T = any> {
  addListener(options: IAddListenerOptions<T>): IAddListenerResult;
  removeListener(options: IRemoveListenerOptions): IRemoveListenerResult;
  close(): void;
  connect(): Promise<void>;
  getClient(): WebSocket;
}

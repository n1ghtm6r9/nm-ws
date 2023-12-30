import { Inject, Injectable, Logger } from '@nestjs/common';
import { UnsubscribeWebSocketEventsService } from './UnsubscribeWebSocketEventsService';
import { webSocketsStoreKey } from '../constants';
import { IWebSocketsStore, ICloseWebSocketClientOptions } from '../interfaces';

@Injectable()
export class CloseWebSocketClientService {
  constructor(
    @Inject(webSocketsStoreKey) protected readonly store: IWebSocketsStore,
    protected readonly unsubscribeWebSocketEventsService: UnsubscribeWebSocketEventsService,
  ) {}

  public async call({ stateId }: ICloseWebSocketClientOptions) {
    const state = this.store.get(stateId);

    if (!state) {
      return;
    }

    if (state.reconnectTimeoutId) {
      clearTimeout(state.reconnectTimeoutId);
    }

    if (state.callGetUrlIntervalId) {
      clearInterval(state.callGetUrlIntervalId);
    }

    this.unsubscribeWebSocketEventsService.call({
      client: state.client,
    });
    state.client?.close();
    this.store.delete(stateId);

    Logger.log(`Success disconnect WebSocket client, url "${state.client.url}"`);
  }
}

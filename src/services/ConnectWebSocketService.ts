import { Inject, Injectable } from '@nestjs/common';
import { webSocketsStoreKey } from '../constants';
import { ReconnectWebSocketClientService } from './ReconnectWebSocketClientService';
import { IWebSocketsStore, IConnectWebSocketOptions } from '../interfaces';

@Injectable()
export class ConnectWebSocketService {
  constructor(
    @Inject(webSocketsStoreKey) protected readonly store: IWebSocketsStore,
    protected readonly reconnectWebSocketClientService: ReconnectWebSocketClientService
  ) {}

  public async call({ stateId, clientOptions }: IConnectWebSocketOptions) {
    await this.reconnectWebSocketClientService.call({
      stateId,
      clientOptions,
    });
  }
}

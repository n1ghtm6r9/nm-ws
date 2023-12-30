import { Inject, Injectable } from '@nestjs/common';
import { UnsubscribeWebSocketEventsService } from './UnsubscribeWebSocketEventsService';
import { webSocketsStoreKey } from '../constants';
import { IRemoveListenerResult, IWebSocketsStore, IRemoveListenerWebSocketClientOptions } from '../interfaces';

@Injectable()
export class RemoveListenerWebSocketClientService {
  constructor(
    @Inject(webSocketsStoreKey) protected readonly store: IWebSocketsStore,
    protected readonly unsubscribeWebSocketEventsService: UnsubscribeWebSocketEventsService
  ) {}

  public call({ stateId, id }: IRemoveListenerWebSocketClientOptions): IRemoveListenerResult {
    const state = this.store.get(stateId);

    if (!state) {
      return {
        ok: false,
      };
    }

    const index = state.callbacks.findIndex(v => v.id === id);

    if (index === -1) {
      return {
        ok: false,
      };
    }

    state.callbacks.splice(index, 1);

    return {
      ok: true,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { uuid } from '@nmxjs/utils';
import { UnsubscribeWebSocketEventsService } from './UnsubscribeWebSocketEventsService';
import { webSocketsStoreKey } from '../constants';
import { IAddListenerResult, IWebSocketsStore, IAddListenerWebSocketClientOptions } from '../interfaces';

@Injectable()
export class AddListenerWebSocketClientService {
  constructor(
    @Inject(webSocketsStoreKey) protected readonly store: IWebSocketsStore,
    protected readonly unsubscribeWebSocketEventsService: UnsubscribeWebSocketEventsService
  ) {}

  public call({ stateId, cb, type }: IAddListenerWebSocketClientOptions): IAddListenerResult {
    const state = this.store.get(stateId);

    if (!state) {
      return {
        id: null,
      };
    }

    const id = uuid();

    state.callbacks.push({
      id,
      cb,
      type,
    });

    return {
      id,
    };
  }
}

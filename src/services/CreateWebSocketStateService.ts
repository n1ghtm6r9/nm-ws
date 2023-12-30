import { uuid } from '@nmxjs/utils';
import { Inject, Injectable } from '@nestjs/common';
import { webSocketsStoreKey } from '../constants';
import { IWebSocketsStore } from '../interfaces';

@Injectable()
export class CreateWebSocketStateService {
  constructor(@Inject(webSocketsStoreKey) protected readonly store: IWebSocketsStore) {}

  public call() {
    const stateId = uuid();

    this.store.set(stateId, {
      clientId: undefined,
      client: undefined,
      callbacks: [],
    });

    return {
      stateId,
    };
  }
}

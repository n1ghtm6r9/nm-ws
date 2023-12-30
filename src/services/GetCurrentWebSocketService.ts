import { Inject, Injectable } from '@nestjs/common';
import { webSocketsStoreKey } from '../constants';
import { IWebSocketsStore, IGetCurrentWebSocketOptions } from '../interfaces';

@Injectable()
export class GetCurrentWebSocketService {
  constructor(@Inject(webSocketsStoreKey) protected readonly store: IWebSocketsStore) {}

  public call = ({ stateId }: IGetCurrentWebSocketOptions) => this.store.get(stateId)?.client;
}

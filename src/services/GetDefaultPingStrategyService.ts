import type { WebSocket } from 'ws';
import { FunctionType } from '@nmxjs/types';
import { Injectable } from '@nestjs/common';
import { IWebSocketClientPingStrategyResult } from '../interfaces';

@Injectable()
export class GetDefaultPingStrategyService {
  public call = (client: WebSocket): IWebSocketClientPingStrategyResult => ({
    ping: () => client.ping(),
    pong: (cb: FunctionType) => client.on('pong', cb),
  });
}

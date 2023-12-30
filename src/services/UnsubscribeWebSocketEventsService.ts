import { Injectable } from '@nestjs/common';
import { IUnsubscribeWebSocketEventsOptions } from '../interfaces';

@Injectable()
export class UnsubscribeWebSocketEventsService {
  public async call({ client }: IUnsubscribeWebSocketEventsOptions) {
    client?.removeAllListeners('open');
    client?.removeAllListeners('close');
    client?.removeAllListeners('error');
    client?.removeAllListeners('message');
    client?.removeAllListeners('ping');
    client?.removeAllListeners('pong');
  }
}

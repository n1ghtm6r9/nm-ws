import math from 'big.js';
import { WebSocket } from 'ws';
import { sleep, uuid } from '@nmxjs/utils';
import { CustomError } from '@nmxjs/errors';
import { Injectable, Logger } from '@nestjs/common';
import { ICreateWebSocketOptions } from '../interfaces';
import { tryReconnectCountLimit as defaultTryReconnectCountLimit } from '../constants';
import { UnsubscribeWebSocketEventsService } from './UnsubscribeWebSocketEventsService';

@Injectable()
export class CreateWebSocketService {
  constructor(protected readonly unsubscribeWebSocketEventsService: UnsubscribeWebSocketEventsService) {}

  public async call({ getUrl, tryReconnectCountLimit = defaultTryReconnectCountLimit }: ICreateWebSocketOptions) {
    let url: string;
    let client: WebSocket;

    for (let i = 0; i < tryReconnectCountLimit; i++) {
      client = await new Promise<WebSocket>(async resolve => {
        url = await Promise.resolve(getUrl()).catch(() => null);

        if (!url) {
          Logger.warn('Connect WebSocket client failed to get url!');
          return resolve(null);
        }

        const newClient = new WebSocket(url);
        newClient.once('open', () => {
          this.unsubscribeWebSocketEventsService.call({ client: newClient });
          resolve(newClient);
        });
        newClient.once('close', code => {
          Logger.warn(`Connect WebSocket client failed to connect, exit code "${code}"!`);
          resolve(null);
        });
        newClient.once('error', error => {
          Logger.warn(`Connect WebSocket client failed to connect, error: "${error.message}"`);
          resolve(null);
        });
      });

      if (client) {
        break;
      }

      await sleep({ time: 1000 });

      Logger.warn(`Create WebSocket client failed, try ${math(i).add(1).toString()}/${tryReconnectCountLimit}`);
    }

    if (!client) {
      throw new CustomError(`WebSocket "${url}" reconnect limit reached!`);
    }

    Logger.log(`Success connect WebSocket client, url "${url}"`);

    return {
      id: uuid(),
      client,
      url,
    };
  }
}

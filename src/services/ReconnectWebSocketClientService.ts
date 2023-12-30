import math from 'big.js';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { parseJson } from '@nmxjs/utils';
import * as Constants from '../constants';
import { IWebSocketsStore, WsEventTypeEnum, IReconnectWebSocketClientServiceOptions } from '../interfaces';
import { CreateWebSocketService } from './CreateWebSocketService';
import { GetDefaultPingStrategyService } from './GetDefaultPingStrategyService';
import { UnsubscribeWebSocketEventsService } from './UnsubscribeWebSocketEventsService';

@Injectable()
export class ReconnectWebSocketClientService {
  constructor(
    @Inject(Constants.webSocketsStoreKey) protected readonly store: IWebSocketsStore,
    protected readonly createWebSocketService: CreateWebSocketService,
    protected readonly getDefaultPingStrategyService: GetDefaultPingStrategyService,
    protected readonly unsubscribeWebSocketEventsService: UnsubscribeWebSocketEventsService
  ) {}

  public async call(options: IReconnectWebSocketClientServiceOptions) {
    const {
      stateId,
      clientOptions: {
        getUrl,
        reconnectAfterMs,
        callGetUrlIntervalMs,
        networkDelayLimitMs = Constants.networkDelayLimitMs,
        pingIntervalMs = Constants.pingIntervalMs,
        tryReconnectCountLimit = Constants.tryReconnectCountLimit,
      },
    } = options;
    const state = this.store.get(stateId);

    if (!state) {
      return;
    }

    if (state.callGetUrlIntervalId) {
      clearInterval(state.callGetUrlIntervalId);
    }

    const lastClient = state.client;
    let reconnectIsCall = false;
    let lastPingAt = 0;

    const {
      id: clientId,
      client,
      url,
    } = await this.createWebSocketService.call({
      getUrl,
      tryReconnectCountLimit,
    });

    const pingStrategy = (options.clientOptions.pingStrategy || this.getDefaultPingStrategyService.call)(client);

    client.on('message', rawData => {
      const currentState = this.store.get(stateId);

      if (!currentState || currentState.clientId !== clientId) {
        return;
      }

      const data = parseJson({ data: rawData.toString() }) || rawData.toString();
      currentState.callbacks.forEach(cbData => {
        if (cbData.type === WsEventTypeEnum.DATA) {
          cbData.cb(data);
        }
      });
    });

    pingStrategy.pong(() => {
      const currentState = this.store.get(stateId);

      if (!currentState || currentState.clientId !== clientId) {
        return;
      }

      const networkDelayMs = math(Date.now()).minus(lastPingAt).toNumber();

      if (networkDelayMs >= networkDelayLimitMs) {
        currentState.callbacks.forEach(cbData => {
          if (cbData.type === WsEventTypeEnum.NETWORK_DELAY) {
            cbData.cb(networkDelayMs);
          }
        });
      }

      setTimeout(() => {
        lastPingAt = Date.now();
        pingStrategy.ping();
      }, pingIntervalMs);
    });

    client.on('close', (code, reason) => {
      Logger.warn(`WebSocket client close, exit code "${code}", reason "${reason}"!`);
      if (!reconnectIsCall) {
        reconnectIsCall = true;
        this.call(options);
      }
    });
    client.once('error', error => {
      Logger.warn(`WebSocket client error: "${error.message}"`);
      if (!reconnectIsCall) {
        reconnectIsCall = true;
        this.call(options);
      }
    });

    const reconnectTimeoutId = reconnectAfterMs
      ? setTimeout(() => {
          Logger.log('WebSocket client reconnect interval!');
          this.call(options);
        }, reconnectAfterMs)
      : null;

    const callGetUrlIntervalId = callGetUrlIntervalMs
      ? setInterval(async () => {
          Logger.log('Call get url interval!');
          const newUrl = await getUrl();

          if (url !== newUrl) {
            Logger.log('Call get url interval has new url, reconnect ws!');
            this.call(options);
          }
        }, callGetUrlIntervalMs)
      : null;

    this.store.set(stateId, {
      ...state,
      clientId,
      client,
      reconnectTimeoutId,
      callGetUrlIntervalId,
    });

    this.unsubscribeWebSocketEventsService.call({
      client: lastClient,
    });
    lastClient?.close();
    lastPingAt = Date.now();
    pingStrategy.ping();
    state.callbacks.forEach(cbData => {
      if (cbData.type === WsEventTypeEnum.AFTER_CONNECT) {
        cbData.cb();
      }
    });
  }
}

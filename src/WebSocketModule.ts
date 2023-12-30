import { Global, Module } from '@nestjs/common';
import { IWebSocketFactory, IWebSocketsStore } from './interfaces';
import { webSocketFactoryKey, webSocketsStoreKey } from './constants';
import * as Services from './services';

@Global()
@Module({
  providers: [
    ...Object.values(Services),
    {
      provide: webSocketsStoreKey,
      useFactory: (): IWebSocketsStore => new Map(),
    },
    {
      provide: webSocketFactoryKey,
      useFactory: (
        createWebSocketStateService: Services.CreateWebSocketStateService,
        closeWebSocketClientService: Services.CloseWebSocketClientService,
        addListenerWebSocketClientService: Services.AddListenerWebSocketClientService,
        removeListenerWebSocketClientService: Services.RemoveListenerWebSocketClientService,
        getCurrentWebSocketService: Services.GetCurrentWebSocketService,
        connectWebSocketService: Services.ConnectWebSocketService
      ): IWebSocketFactory => ({
        create: options => {
          const { stateId } = createWebSocketStateService.call();
          return {
            addListener: addListenerOptions =>
              addListenerWebSocketClientService.call({
                stateId,
                ...addListenerOptions,
              }),
            removeListener: removeListenerOptions =>
              removeListenerWebSocketClientService.call({
                stateId,
                ...removeListenerOptions,
              }),
            close: () => closeWebSocketClientService.call({ stateId }),
            connect: () => connectWebSocketService.call({ stateId, clientOptions: options }),
            getClient: () => getCurrentWebSocketService.call({ stateId }),
          };
        },
      }),
      inject: [
        Services.CreateWebSocketStateService,
        Services.CloseWebSocketClientService,
        Services.AddListenerWebSocketClientService,
        Services.RemoveListenerWebSocketClientService,
        Services.GetCurrentWebSocketService,
        Services.ConnectWebSocketService,
      ],
    },
  ],
  exports: [webSocketFactoryKey],
})
export class WebSocketModule {}

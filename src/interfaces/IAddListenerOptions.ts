import { ICallback } from '@nmxjs/types';
import { WsEventTypeEnum } from './WsEventTypeEnum';

export interface IAddListenerOptions<T = any> {
  type: WsEventTypeEnum;
  cb: ICallback<T>;
}

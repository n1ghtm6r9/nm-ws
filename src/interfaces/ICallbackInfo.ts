import { ICallback } from '@nmxjs/types';
import { WsEventTypeEnum } from './WsEventTypeEnum';

export interface ICallbackInfo<T = any> {
  id: string;
  cb: ICallback<T>;
  type: WsEventTypeEnum;
}

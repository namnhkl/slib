import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line import/no-cycle
import { _StoppableInjector } from './stoppable.decorator';
import { _HttpRequestInjector } from './api/http-request.decorator';
import { UrlModel } from './api/apiBuilder';

/**
 * Abstract class that implements both `_HttpRequestInjector` and `_StoppableInjector` interfaces.
 * Provides a structure for HTTP operations that can be stopped.
 *
 * @usageNote
 * When use ⁣```@HttpRequestInjectable``` and ```@Stoppable``` same time,
 * need extends this abstract class for methods/properties declarations
 *
 * @abstract
 * @implements {_HttpRequestInjector}
 * @implements {_StoppableInjector}
 */
export abstract class HttpStoppable implements _HttpRequestInjector, _StoppableInjector {
  _http!: HttpClient;

  stop!: () => void;

  urlObject!: UrlModel;
}

export type AnyObject = {
  [x: string]: any
};

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TApiPrefix } from '../../constants/api.constants';
import { UrlModel, URL_BUILDERS } from './apiBuilder';

/**
 * Abstract class provides properties for URL handling and HTTP client.
 *
 * @abstract
 * @property {UrlModel} urlObject - The URL model object.
 * @property {HttpClient} _http - The HTTP client instance.
 */
export abstract class _HttpRequestInjector {
  urlObject!: UrlModel;

  _http!: HttpClient;
}

/**
 * Decorator function to inject API-related dependencies into a class.
 *
 * @param {TApiPrefix} prefixKey - The API prefix key used to build URLs.
 *
 * @example
 * ```typescript
 * ⁣@HttpRequestInjectable('permissiondatas')
 * export class PermissionDataServiceCustom extends _HttpRequestInjector {
 *   createMulti(model: any) {
 *     return this._http.post<any>(this.urlObject.buildUrl({ endpoint: 'createmulti' }), model);
 *   }
 * }
 * ```
 */
export function HttpRequestInjectable(prefixKey: TApiPrefix) {
  return function <T extends { new (...args: any[]): any }>(_constructor: T) {
    return new Proxy(_constructor, {
      construct(clz, args) {
        const obj = Reflect.construct(clz, args);
        obj.urlObject = URL_BUILDERS[prefixKey];
        obj._http = inject(HttpClient);
        return obj;
      },
    });
  };
}

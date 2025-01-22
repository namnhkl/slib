import { environment } from 'environments/environment';
import _ from 'lodash';
import { API_PREFIX, TApiPrefix } from '../../constants/api.constants';
import { CommonService } from '../../services/common.service';

type TBuildUrl = {
  endpoint: string,
  queryObject?: { [x: string]: any }
};

/**
 * Represents a model for building URLs with a specific prefix.
 */
export class UrlModel {
  /**
   * The prefix to be used in the URL.
   */
  prefix: string;

  /**
   * The environment configuration.
   * @private
   */
  private _environment = environment;

  /**
   * Service for handling query parameters.
   */
  queryService: CommonService;

  /**
   * Creates an instance of UrlModel.
   * @param prefix - The prefix to be used in the URL.
   */
  constructor(prefix: string) {
    this.prefix = prefix;
    this.queryService = new CommonService();
  }

  /**
   * Gets the base URL with the prefix.
   * @returns The base URL.
   */
  get baseUrl(): string {
    return `${this._environment.authServer}${this.prefix}`;
  }

  /**
   * Builds a complete URL with the given endpoint and query parameters.
   * @param params - The parameters for building the URL.
   * @param params.endpoint - The endpoint to be appended to the base URL.
   * @param params.queryObject - The query parameters to be appended to the URL.
   * @returns The complete URL.
   * @example
   * const urlModel = new UrlModel('/api');
   * const url = urlModel.buildUrl({ endpoint: 'users', queryObject: { id: 1 } });
   * console.log(url); // Output: 'http://example.com/api/users?id=1'
   */
  buildUrl({ endpoint, queryObject = {} }: TBuildUrl): string {
    let queryString = '';

    if (!_.isEmpty(queryObject)) {
      queryString = `?${this.queryService.convertModelToParams(queryObject)}`;
    }

    return `${this.baseUrl}/${endpoint}${queryString}`;
  }
}

/**
 * A record of URL builders for different API prefixes.
 */
export const URL_BUILDERS: Record<TApiPrefix, UrlModel> = Object
  .keys(API_PREFIX)
  .reduce((acc, cur) => {
    acc[cur] = new UrlModel(
      API_PREFIX[cur as TApiPrefix],
    );
    return acc;
  }, {} as any);

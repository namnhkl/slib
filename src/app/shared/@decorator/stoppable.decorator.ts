import _ from 'lodash';
import {
  isObservable, Subject, takeUntil,
} from 'rxjs';
// eslint-disable-next-line import/no-cycle
import { HttpStoppable } from './type.decorator';
import { AnyObject } from '../types/common';

export abstract class _StoppableInjector {
  stop!: () => void;
}

/**
 * Type definition for the arguments of the Stoppable decorator.
 *
 * @template S - The type of the object containing the functions to exclude from unsubscribing.
 */
type StoppableArgs<S> = {
  /**
   * The function names you don't want to unsubscribe when destroyed.
   */
  excludes?: (keyof S)[],

  /**
   * Determines whether verbose logging should be enabled.
   */
  verboseLogging?: string
};

/**
 * A decorator that enhances a class with the ability to stop observables.
 *
 * This decorator should be used on classes that extend `_StoppableInjector`.
 * It proxies all methods of the class and ensures that any returned observables
 * are automatically unsubscribed when the `stop` method is called.
 *
 * @param {StoppableArgs} params - Options config stoppable
 *
 * @returns A class decorator function.
 *
 * @example
 * ```
 * ⁣⁣⁣Stoppable()
 * class MyService extends _StoppableInjector {
 *   constructor(private service: SomeService) {
 *
 *   }
 *
 *  ngOnIni() {
 *    service.myObservableMethod().subscribe();
 *  }
 *
 *  ngOnDestroy() {
 *    service.stop(); // This will unsubscribe from all observables
 *  }
 * }
 * ```
 */
export function Stoppable<S = AnyObject>(params?: StoppableArgs<Omit<S, keyof HttpStoppable>>) {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    const destroy$ = new Map<any, Subject<any>>();

    const logger = (message: string, ...args: any) => {
      if (params?.verboseLogging) {
        console.trace(`[${params.verboseLogging}]: ${message}`, ...args);
      }
    };

    /**
     *  @copyright https://stackoverflow.com/questions/60363513/how-to-execute-a-function-before-and-after-each-class-method-call
    */
    const attachDestroyer = {
      /**
       * The apply will be fired each time the function is called
       * @param  target Called function
       * @param  scope  Scope from where function was called
       * @param  args   Arguments passed to function
       * @return        Results of the function
       */
      apply(target: any, scope: any, args: any) {
        // here we bind method with our class by accessing reference to instance
        const results = target.bind(scope)(...args);

        const func_name = target.name;
        logger(`%c${func_name} was executed`, 'color: green');

        if (isObservable(results)) {
          // if excludes exist not pipe destroy
          if (!_.isEmpty(params)) {
            const excludes = _.get(params, 'excludes', []);
            if (_.includes(excludes, func_name)) return results;
          }

          destroy$.set(results, new Subject<boolean>());

          const modifiedObservable = results.pipe(
            takeUntil(destroy$.get(results)!),
          );

          return modifiedObservable;
        }

        return results;
      },
    };

    const stopHandler = () => {
      logger(`%cService ${constructor.name} was stop with excludes observables: ${params?.excludes?.toString() || []}`, 'color: red');
      destroy$.forEach((value) => {
        value.next(true);
        value.complete();
      });
      destroy$.clear();
    };

    const interceptedMethod = (obj: any) => {
      // Get all methods of choosen class
      const methods = Object.getOwnPropertyNames(constructor.prototype);

      // Find and remove constructor as we don't need Proxy on it
      const consIndex = methods.indexOf('constructor');
      if (consIndex > -1) methods.splice(consIndex, 1);

      // Replace all methods with Proxy methods
      methods.forEach((methodName) => {
        if (isObservable(obj[methodName])) {
          // eslint-disable-next-line rxjs/no-ignored-observable
          obj[methodName].pipe(
            takeUntil(destroy$.get(obj[methodName])!),
          );
          return;
        }

        if (_.isFunction(obj[methodName])) {
          obj[methodName] = new Proxy(obj[methodName], attachDestroyer);
        }
      });
    };

    return new Proxy(constructor, {
      construct(clz, args) {
        const obj = Reflect.construct(clz, args);

        obj.stop = stopHandler;

        interceptedMethod(obj);

        return obj;
      },
    });
  };
}

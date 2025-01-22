/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import {
  isObservable, Subject, takeUntil,
} from 'rxjs';
// eslint-disable-next-line import/no-cycle
import { HttpStoppable } from './type.decorator';
export type AnyObject = {
  [x: string]: any
};

export abstract class _StoppableInjector {
  stop!: () => void;
}

type StoppableArgs<S> = {
  /**
   * The function names you don't want to unsubscribe when destroy
   */
  excludes?: (keyof S)[]
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return class extends constructor {
      /**
       * Store observables into a Map object
       */
      private destroy$ = new Map<any, Subject<any>>();

      /**
       *  @copyright https://stackoverflow.com/questions/60363513/how-to-execute-a-function-before-and-after-each-class-method-call
       */
      proxyHandle = {
        // little hack where we save refrenece to our class inside the object
        main: this,
        /**
         * The apply will be fired each time the function is called
         * @param  target Called function
         * @param  scope  Scope from where function was called
         * @param  args   Arguments passed to function
         * @return        Results of the function
         */
        apply(target: any, scope: any, args: any) {
          // here we bind method with our class by accessing reference to instance
          const results = target.bind(this.main)(...args);

          if (isObservable(results)) {
            const func_name = target.name;

            // if excludes exist not pipe destroy
            if (!_.isEmpty(params)) {
              const excludes = _.get(params, 'excludes', []);
              if (_.includes(excludes, func_name)) return results;
            }

            this.main.destroy$.set(results, new Subject<boolean>());

            const modifiedObservable = results.pipe(
              takeUntil(this.main.destroy$.get(results)!),
            );

            return modifiedObservable;
          }

          return results;
        },
        // get: function (target, prop, receiver) {
        //   if (prop === 'secret') {
        //     return `${target.secret.substring(0, 4)} ... shhhh!`;
        //   }
        //   return Reflect.get(...arguments);
        // },
      };

      constructor() {
        super();

        // Get all methods of choosen class
        const methods = Object.getOwnPropertyNames(constructor.prototype);

        // Find and remove constructor as we don't need Proxy on it
        const consIndex = methods.indexOf('constructor');
        if (consIndex > -1) methods.splice(consIndex, 1);

        // Replace all methods with Proxy methods
        methods.forEach((methodName) => {
          if (isObservable(this[methodName])) {
            // eslint-disable-next-line rxjs/no-ignored-observable
            this[methodName].pipe(
              takeUntil(this.destroy$.get(this[methodName])!),
            );
            return;
          }

          if (_.isFunction(this[methodName])) {
            this[methodName] = new Proxy(this[methodName], this.proxyHandle);
          }
        });
      }

      stop = () => {
        this.proxyHandle.main.destroy$.forEach((value) => {
          value.next(true);
          value.complete();
        });
        this.proxyHandle.main.destroy$.clear();
      };
    };
  };
}

import _ from 'lodash';

/**
 * Transforms an object by applying a transformation function to each value.
 * If the value is a function, it will be called with the provided arguments.
 * If the value is a string and contains a dot,
 * it will retrieve the value from the object using lodash's `get` function.
 * @param object - The object to transform.
 * @param args - Additional arguments to pass to the transformation function.
 * @returns The transformed object.
 */
export const _transform = (object: any, ...args: any) => {
  return _.mapValues(object, (value) => {
    if (_.isFunction(value)) {
      return value(...args);
    }

    if (_.isString(value) && value.includes('.')) {
      return _.get(object, value, null);
    }

    return value;
  });
};

type TExtendPartial<T> = NoInfer<Partial<{
  [x in keyof T]: any
}>>;

/**
 * Overrides the properties of an object with the provided partial values.
 * @typeparam T - The type of the object to override.
 * @param extendValue - The partial values to override the object with.
 * @returns A function that takes an object and returns a new object with the overridden properties.
 */
export function _override<T = any>(extendValue: TExtendPartial<T>): () => T {
  return (...args: any) => {
    return ({ ...args[0], ..._transform(extendValue, ...args) });
  };
}

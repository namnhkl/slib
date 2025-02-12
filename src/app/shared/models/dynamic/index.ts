import { IProjectValue, IValues } from './type';

export class DynamicCategory {
  private _projectValue: IProjectValue = {
    project_type: 'project_type',
  };

  /**
   * @summary Lấy dữ liệu từ bảng Danh sách danh mục động, rồi sau đó join lại cùng dấu ","
   *
   * Gets values from {@link IProjectValue} based on a list of keys
   * @param keys List of keys to get values from
   * @returns A comma-separated string of the values
   * @throws
   * Error if `keys` is not an array or if any key in `keys` does not exist in `IProjectValue`
   */
  getValuesByKeys(keys: (keyof IProjectValue)[]): string {
    if (!Array.isArray(keys)) throw new Error('Dynamic Key does not exist');

    // Get values and filter out undefined ones
    const result = keys
      .map((key: keyof IProjectValue) => (
        this._projectValue[key])).filter((value: string) => value);

    return result.join(','); // Join values into a comma-separated string
  }

  /**
   * @summary Lấy dữ liệu từ bảng Danh sách danh mục động chuẩn
   *
   * Gets the value of a key from {@link IProjectValue}
   * @param key The key to get the value from
   * @returns The value of the key
   * @throws Error if the key does not exist in `IProjectValue`
   */
  getValue(key: (keyof IProjectValue)) : IValues {
    // if undefined
    if (!key) {
      throw new Error('Dynamic Key does not exist');
    }
    return this._projectValue[key];
  }

  getProjectValueList() {
    return this._projectValue;
  }
}

export const _dynamic = new DynamicCategory();

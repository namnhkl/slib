/**
 * @BangDONG url http://192.168.0.43:9090/category/dynamic-category
 */
export interface IProjectValue {
  project_type: 'project_type',
}

export type IValues = IProjectValue[keyof IProjectValue];

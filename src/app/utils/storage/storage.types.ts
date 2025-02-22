interface StorageObjectMap {
  appSession: {
    user: string;
    token: string;
  };
}

export type StorageObjectType = 'appSession';

export interface StorageObjectData<T extends StorageObjectType> {
  type: T;
  data: StorageObjectMap[T];
}

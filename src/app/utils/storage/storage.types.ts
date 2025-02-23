interface StorageObjectMap {
  access_token: string;
  appSession: {
    user: string;
  };
}

export type StorageObjectType = keyof StorageObjectMap;

export interface StorageObjectData<T extends StorageObjectType> {
  type: T;
  data: StorageObjectMap[T];
}

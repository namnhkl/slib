interface StorageObjectMap {
  access_token: string;
  appSession: {
    id: string;
    bsThuVienTen: string;
    bdNhomTen: string;
    soThe: string;
    hoTen: string;
    gioiTinh: string;
    ngaySinh: string;
    email: string;
    dienThoai: string;
    anhDaiDien: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    ngayKhoaTheTu: string;
    ngayKhoaTheDen: string;
    diaChi: string;
    nguoiLienHe: string;
  };
}

export type StorageObjectType = keyof StorageObjectMap;

export interface StorageObjectData<T extends StorageObjectType> {
  type: T;
  data: StorageObjectMap[T];
}

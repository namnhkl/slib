export interface IResDanhMucSachHay {
  messageCode: number;
  messageText: string;
  data?: DanhMucSachHay[] | null;
  totalRecord: number;
}

export interface DanhMucSachHay {
  id: string;
  qtndHtNgonNguId: string;
  qtndDmLoaiThuMucId: string;
  ten: string;
  ngayDangTin: string;
  anhDaiDien: string;
  moTa: string;
  noiDung: string;
  tepTin01Ten: string;
  tepTin01DuongDan: string;
  tepTin02Ten: string;
  tepTin02DuongDan: string;
  tepTin03Ten: string;
  tepTin03DuongDan: string;
  tepTin04Ten: string;
  tepTin04DuongDan: string;
  tepTin05Ten: string;
  tepTin05DuongDan: string;
  slXem: number;
}

export interface QueryDanhMucSachHayParams {
  qtndHtNgonNguId?: string | number;
  bsThuVienId: string | number;
  pageIndex?: number;
  pageSize?: number;
  ten?: string;
  secretKey?:string;
  qtndDmLoaiThuMucId?:string;
}

export interface IResSachHay {
  messageCode: number;
  messageText: string;
  data?: SachHay[] | null;
  totalRecord: number;
}


export interface SachHay {
  id: string;
  qtndHtNgonNguId: string;
  qtndDmLoaiThuMucId: string;
  ten: string;
  ngayDangTin: string;
  anhDaiDien: string;
  moTa: string;
  noiDung: string;
  tepTin01Ten: string;
  tepTin01DuongDan: string;
  tepTin02Ten: string;
  tepTin02DuongDan: string;
  tepTin03Ten: string;
  tepTin03DuongDan: string;
  tepTin04Ten: string;
  tepTin04DuongDan: string;
  tepTin05Ten: string;
  tepTin05DuongDan: string;
  slXem: number;
}

export interface QuerySachHayParams {
  qtndHtNgonNguId?: string | number;
  bsThuVienId: string | number;
  id:string,
  secretKey?:string;
}
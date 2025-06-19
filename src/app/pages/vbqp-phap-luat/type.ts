export interface IResChiTietVanBan {
  messageCode: number;
  messageText: string;
  data?: ChiTietVanBan[] | null;
  totalRecord: number;
}

export interface ChiTietVanBan {
  id: string;
  qtndHtNgonNguId: string;
  qtndDmLoaiVanBan: string;
  bsThuVienId: string;
  thuMuc: string | null;
  soKyHieu: string;
  ten: string;
  coQuan: string;
  nguoiKy: string;
  chucVu: string;
  ngayBanHanh: string;
  noiDung: string;
  tepTin01Ten: string | null;
  tepTin01DuongDan: string | null;
  tepTin02Ten: string | null;
  tepTin02DuongDan: string | null;
  tepTin03Ten: string | null;
  tepTin03DuongDan: string | null;
  tepTin04Ten: string | null;
  tepTin04DuongDan: string | null;
  tepTin05Ten: string | null;
  tepTin05DuongDan: string | null;
  slXem: number;
}

export interface ChiTietVanBanQueryParams {
  qtndHtNgonNguId?: string;
  qtndDmLoaiVanBanId?: string;
  id: string;
  ten?: string;
  soKyHieu?: string;
  pageIndex?: number;
  pageSize?: number;
  bsThuVienId: string;
}

export interface VanBanQueryParams {
  qtndHtNgonNguId?: string;
  qtndDmLoaiVanBanId?: string;
  id?: string;
  ten?: string;
  soKyHieu?: string;
  pageIndex?: number;
  pageSize?: number;
  bsThuVienId: string;
}


export interface IResDanhSachVanBan {
  messageCode: number;
  messageText: string;
  data?: DanhSachVanBan[] | null;
  totalRecord: number;
}

export interface DanhSachVanBan {
  id: string;
  qtndHtNgonNguId: string;
  qtndDmLoaiVanBan: string;
  bsThuVienId: string;
  thuMuc: string | null;
  soKyHieu: string;
  ten: string;
  coQuan: string;
  nguoiKy: string;
  chucVu: string;
  ngayBanHanh: string;
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


export interface DanhSachVanBanQueryParams {
  qtndHtNgonNguId?: string;
  qtndDmLoaiVanBanId?: string;
  id?: string;
  ten?: string;
  soKyHieu?: string;
  pageIndex?: number;
  pageSize?: number;
  bsThuVienId: string;
}

export interface LoaiVanBan {
  id: string;
  qtndHtNgonNguId: string;
  ten: string;
  sapXep: number;
}

export interface LoaiVanBanQueryParams {
  qtndHtNgonNguId?: string;
  id?: string;
  ten?: string;
}

export interface IResLoaiVanBan {
  messageCode: number;
  messageText: string;
  data?: LoaiVanBan[] | null;
  totalRecord: number;
}
export interface HtThanhChucNang {
  id: string;
  qtndHtNgonNguId: string;
  qtndHtThanhChucNangId: string;
  ten: string;
  sapXep: number;
  duongDan: string;
  moCuaSoMoi: number;
}


export interface ThanhChucNangParams {
  bsThuVienId: string;
  qtndHtNgonNguId: number | string;
  pageIndex?: number;
  pageSize?: number;
  secretKey?:string;
}


export interface CopyRightParams {
  bsThuVienId: string;
  qtndHtNgonNguId: string;
  pageIndex?: number;
  pageSize?: number;
  secretKey?:string;
  ma?:string;
}

export interface CopyRight {
  id: string;
  ma: string;
  ten: string;
  noiDung: number;
}


export interface ThongKeTruyCapParams {
  bsThuVienId: string;
  secretKey?:string;
}

export interface ThongKeTruyCap {
  tongSoTrucTuyen: number;
  tongSoTruyCapTrongThang: number;
  tongSoTruyCap: number;
}


export interface QtndHtThanhChucNangItem {
  id: string;
  qtndHtNgonNguId: string;
  qtndHtThanhChucNangId: string;
  ten: string;
  sapXep: number;
  duongDan: string;
  moCuaSoMoi: number;
}

export interface QtndHtThanhChucNangParams {
  qtndHtNgonNguId: number | string;
  bsThuVienId: number | string;
  pageIndex?: number;
  pageSize?: number;
}

export interface DanhMucAnh {
  id: string;
  qtndHtNgonNguId: string;
  bsThuVienId: string;
  ten: string;
  ngayXuatBan: string;
  anhDaiDien: string;
  moTa: string;
  noiDung: string;
  trangChu: boolean | null;
  trangThai: number;
}

export interface DanhMucAnhQuery {
  qtndHtNgonNguId?: number | string;
  bsThuVienId: number | string;
  ten?: string;
  pageIndex?: number;
  pageSize?: number;
}


export interface ThuVienAnhChiTiet {
  id: string;
  ten: string;
  tepTinDuongDan: string;
  sapXep: number;
}

export interface ChiTietAnh {
  id: string;
  qtndHtNgonNguId: string;
  bsThuVienId: string;
  ten: string;
  ngayXuatBan: string;
  anhDaiDien: string;
  moTa: string;
  noiDung: string;
  trangChu: boolean | null;
  trangThai: number;
  qtndGtThuVienAnhChiTiet: ThuVienAnhChiTiet[];
}


export interface ChiTietAnhQuery {
  qtndHtNgonNguId: string | number;
  bsThuVienId: string | number;
  id: string;
}
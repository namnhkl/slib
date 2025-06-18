export interface GioiThieuModel {
  id: string;
  qtndHtNgonNguId: string;
  qtndGioiThieu: string;
  ten: string;
  sapXep: number;
  anhDaiDien: string | null;
  moTa: string;
}


export interface GioiThieuParams {
  bsThuVienId: string;
  pageIndex?: number;
  pageSize?: number;
  secretKey?:string;
  qtndHtNgonNguId?:number
}


export interface GioiThieuChiTietParams {
  bsThuVienId: string;
  id:string
  secretKey?:string;
}


export interface GioiThieuChitietModel {
  id: string;
  qtndHtNgonNguId: string;
  qtndGioiThieu: string;
  ten: string;
  sapXep: number;
  anhDaiDien: string | null;
  moTa: string;
  noiDung: string;
}

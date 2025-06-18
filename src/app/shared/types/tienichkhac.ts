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
  qtndHtNgonNguId: string;
  pageIndex?: number;
  pageSize?: number;
  secretKey?:string;
}

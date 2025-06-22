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





export interface IBoSach {
  id:string,
  ten:string,
  sapXep:number
}

export interface IqtndDmLoaiThuMuc {
  id:string,
  ten:string,
  sapXep:number
}


export interface IBoSachParams {
  bsThuVienId?: string;
  qtndHtNgonNguId?: string;
  pageIndex?: number;
  pageSize?: number;
  secretKey?:string;
  ten?:string;
}



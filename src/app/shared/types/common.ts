export type AnyObject = {
  [x: string]: any;
};

export interface IResponse<T> {
  data: T;
  messageCode: number;
  messageText: string;
  totalRecord: number;
}

export interface IPageParams {
  pageIndex?: number;
  pageSize?: number;
}

export interface ITinTucParams extends IPageParams {
  qtndHtNgonNguId?: string;
  qtndTtNhomTinTucId?: string;
  id?: string;
  ten?: string;
}

interface IAuthor {
  giaTri: string;
}
export interface IBoook {
  id: string;
  anhDaiDien: string | null;
  tieuDe: string;
  tacGia: IAuthor[];
  thongTinXuatBan: string;
  slBanIn: number;
  slBanSo: number;
  slXem: number;
  diemDanhGia: number;
}


export interface BookRead {
  soThe: string;
  bmTaiLieuId: string;
  anhDaiDien: string;
  tieuDe: string;
  tacGia?: (TacGiaEntity)[] | null;
  thongTinXuatBan: string;
  moTaVatLy: string;
  ngayGhiMuon: string;
  ngayTraDuKien: string;
  ngayTraThucTe: string;
}
export interface TacGiaEntity {
  giaTri: string;
}

import { IResponse } from "@/app/shared/types/common";

export interface TacGia {
  giaTri: string
}

export interface IBook {
  id: string
  anhDaiDien?: string
  tieuDe: string
  tacGia: TacGia[]
  thongTinXuatBan: string
  slBanIn: number
  slBanSo: number
  slXem: number
  diemDanhGia: number
}

export interface IBookSearchResponse extends IResponse<IBook[]> {}

export interface IBookOptions {
  tieuDe: string,
  id: string
}

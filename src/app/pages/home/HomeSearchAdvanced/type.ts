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

export interface IChuyenDeOption {
  id: string
  anhDaiDien?: string
  ten: string
}

export interface IChuyenDeOptionResponse extends IResponse<IChuyenDeOption[]> {}

export interface IBookSearchResponse extends IResponse<IBook[]> {}

export interface IBookOptions {
  tieuDe: string,
  id: string
}

export interface IDangTaiLieu {
  id:string,
  ma:string,
  ten:string,
  sapXep:number
}


export interface IBsThuvien {
  id:string,
  ma:string,
  ten:string,
  diaChi:string,
  sapXep:number
}






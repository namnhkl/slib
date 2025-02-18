export interface IDocument {
  id: string
  anhDaiDien: string
  tieuDe: string
  tacGia: TacGum[]
  thongTinXuatBan: string
  moTaVatLy: string
  tuKhoa: TuKhoa[]
  tomTat: string
  slBanIn: number
  dsBanIn: DsBanIn[]
  dsThuVien: DsThuVien[]
  dsKho: DsKho[]
  slBanSo: number
  dsBanSo: DsBanSo[]
  trailer: any
  slXem: number
  diemDanhGia: number
  laTaiLieuQuanTam: number
}

export interface TacGum {
  giaTri: string
}

export interface TuKhoa {
  giaTri: string
}

export interface DsBanIn {
  id: string
  bsThuVienId: string
  bsThuVienMa: string
  bsThuVienTen: string
  bsKhoId: string
  bsKhoMa: string
  bsKhoTen: string
  maDkcb: string
  soDinhDanh: string
  trangThai: number
  laDatMuon: number
}

export interface DsThuVien {
  bsThuVienId: string
  bsThuVienMa: string
}

export interface DsKho {
  bsThuVienId: string
  bsThuVienMa: string
  bsThuVienTen: string
  bsKhoId: string
  bsKhoMa: string
  bsKhoTen: string
}

export interface DsBanSo {
  id: string
  bsThuVienId: string
  bsThuVienMa: string
  bsThuVienTen: string
  loai: string
  ma: string
  ten: string
  banQuyen: string
  slXem: number
  slMua: any
  tepTinDinhDang: any[]
  trangThai: number
}

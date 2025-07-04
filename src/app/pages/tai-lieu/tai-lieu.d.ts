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

// Interface cho tác giả
export interface TacGia {
  giaTri: string | null;
}

// Interface cho mục lục tài liệu
export interface StsTaiLieuMuc {
  id: string;
  stsTaiLieuMucLucId: string;
  tieuDe: string;
  tacGia: TacGia[];
  trang: string;
  noiDung: string;
  tepTinTen: string;
  tepTinDinhDang: string;
  tepTinHanChe: string;
  slXem: number;
  sapXep: number;
  cap: number;
  capMa: string;
}

// Interface cho tài liệu chi tiết
export interface TaiLieuChiTiet {
  id: string;
  stsDmDangtaiLieuId: string;
  stsDmDangtaiLieuTen: string;
  loai: string;
  ma: string;
  tieuDe: string;
  banQuyen: string;
  slXem: number;
  slMua: number | null;
  trangThai: number;
  stsTaiLieuMucDs: StsTaiLieuMuc[];
}

// Interface cho tài liệu mục lục chi tiết
export interface TaiLieuMucLucChiTiet {
  id: string;
  stsTaiLieuMucLucId: string;
  tacgia: TacGia[];
  trang: string;
  noiDung: string;
  tepTinTen: string;
  tepTinDinhDang: string;
  tepTinDungLuong: string;
  tepTinHanChe: string;
  tepTinDuLieu: string;
  slXem: number | null;
  sapXep: number | null;
  cap: number | null;
  capMa: string;
}

export interface imageUrlsBase64 {
  page: number;
  base64: string;
}

export interface IDocumentQueryParams {
  pageIndex?: number,
  pageSize?: number,
  bsThuVienId?: string;
  bmDmDangTaiLieuId?: string;
}

export interface IDanhSachTaiLieuDatMuonParams extends IPageParams {
  tieuDe?: string;
  ngayDangKyTu?: string;
  ngayDangKyDen?: string;
  trangThai?: number;
  bmTaiLieuId?: string
}

export class DanhSachTaiLieuDatMuon {
  id?: string;
  soThe?: string;
  bsThuVienMa?: string;
  bsThuVienTen?: string;
  bsKhoMa?: string;
  bsKhoTen?: string;
  bmTaiLieuId?: string;
  anhDaiDien?: string;
  tieuDe?: string;
  tacGia?: { giaTri: string }[];
  thongTinXuatBan?: string;
  moTaVatLy?: string;
  maDkcb?: string;
  ngayDangKy?: string; // hoặc Date
  ngayKetThuc?: string; // hoặc Date
  trangThai?: number;
  trangThaiTen?: string;
  lyDoTuChoi?: string | null;
}

export interface ThongKeTaiLieuThuVien {
  taiLieuTruyenThong: string | number;
  taiLieuDkcb: string | number;
  taiLieuSo: string | number;
}

export interface ThongKeTaiLieuThuVienQueryParams {
  bsThuVienId: string;
}
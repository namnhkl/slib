export interface IResNews {
  messageCode: number;
  messageText: string;
  data?: New[] | null;
  totalRecord: number;
}

export interface New{
  id: string;
  qtndHtNgonNguId: string;
  qtndTtNhomTinTuc: string;
  ten: string;
  ngayDangTin: string;
  anhDaiDien: string;
  moTa: string;
  noiDung: string;
  nguonTin: string;
  tacGia: string;
  tepTin01Ten: string;
  tepTin01DuongDan: string;
  tepTin02Ten: string;
  tepTin02DuongDan: string;
  tepTin03Ten: string;
  tepTin03DuongDan: string;
  tepTin04Ten: string;
  tepTin04DuongDan: string;
  tepTin05Ten: string;
  tepTin05DuongDan: string;
  slXem: number;
  laTinVideo: number;
  laTinVideoYoutube?: null;
  laTrangChu: number;
  laDongSuKien: number;
}

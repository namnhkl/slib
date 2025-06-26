export interface ITinTuc {
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
  laTinVideoYoutube: number;
  laTrangChu: number;
  laDongSuKien: number;
}

export interface ITinTucQueryParams {
  qtndHtNgonNguId?: string | number;    // vd: ngôn ngữ
  qtndTtNhomTinTucId?: string | number; // nhóm tin tức
  id?: string;                          // id tin tức
  ten?: string;                         // tên tin tức
  ngayDangTinFrom?: string;             // ngày đăng tin từ (nếu backend hỗ trợ filter ngày)
  ngayDangTinTo?: string;               // ngày đăng tin đến
  tacGia?: string;                      // tác giả (nếu backend hỗ trợ)
  nguonTin?: string;                    // nguồn tin (nếu backend hỗ trợ)
  pageIndex?: number;                   // trang hiện tại (phân trang)
  pageSize?: number;                    // số bản ghi trên trang
  laTinVideo?: boolean | number;       // filter tin video (0/1 hoặc true/false)
  laTinVideoYoutube?: boolean | number;
  laTrangChu?: boolean | number;
  laDongSuKien?: boolean | number;
}

export interface INhomTinTuc {
  id:string,
  qtndHtNgonNguId:string,
  ten:string,
  sapXep:number,
  moTa:string
}

export interface INhomTinTucQueryParams {
  id?:string,
  qtndHtNgonNguId?:string,
  ten?:string,
  sapXep?:number,
  moTa?:string,
}

export interface IChiTietTinTuc {
  id: string;
  qtndHtNgonNguId: string | number;
  qtndTtNhomTinTuc: string;
  ten: string;
  ngayDangTin: string;
  anhDaiDien: string;
  moTa: string;
  noiDung: string;
  nguonTin: string;
  tacGia: string;

  tepTin01Ten: string | null;
  tepTin01DuongDan: string;
  tepTin02Ten: string | null;
  tepTin02DuongDan: string;
  tepTin03Ten: string | null;
  tepTin03DuongDan: string;
  tepTin04Ten: string | null;
  tepTin04DuongDan: string;
  tepTin05Ten: string | null;
  tepTin05DuongDan: string;

  slXem: number;
  laTinVideo: number;
  laTinVideoYoutube: number;
  laTrangChu: number;
  laDongSuKien: number;
}


export interface IChiTietTinTucQueryParams {
  id?: string;
  qtndHtNgonNguId?: string | number;
  qtndTtNhomTinTucId?: string;
  ten?: string;
  ngayDangTin?: string;
  laTinVideo?: number;
  laTinVideoYoutube?: number;
  laTrangChu?: number;
  laDongSuKien?: number;
  pageIndex?: number;
  pageSize?: number;
}

//Video Audio

export interface QtndTtNhomTinTucItem {
  id: string;
  ten: string;
  sapXep: number;
}

export interface TinTucVideoAudioModel {
  id: string;
  qtndHtNgonNguId: string;
  qtndTtNhomTinTuc: QtndTtNhomTinTucItem[];
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
  laTinVideoYoutube: number;
  laTrangChu: number;
  laDongSuKien: number;
}


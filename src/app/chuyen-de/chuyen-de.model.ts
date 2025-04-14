
export interface ChuyenDe {
    id: string;
    stsBoSuuTapId: string;
    anhDaiDien: string;
    ten: string;
    moTa: string | null;
    noiDung: string;
    sapXep: number;
    cap: string;
    capSo: number;
    slTaiLieu: number;
  }
  
  export interface ChuyenDeResponse {
    messageCode: number;
    messageText: string;
    data: ChuyenDe[];
    totalRecord: number;
  }
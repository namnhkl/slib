interface ContactInfo {
  qtndHtNgonNguId: string;
  noiDung: string;
}

export interface IContactDetailResponse {
  messageCode: number;
  messageText: string;
  data: ContactInfo[];
  totalRecord: number;
}

export interface ContactFormBody {
  hoTen: string;
  email: string;
  noiDung: string;
  ip: string;
}

export interface IContactResponse {
  messageCode: number;
  messageText: string;
  data: null;
  totalRecord: number;
}

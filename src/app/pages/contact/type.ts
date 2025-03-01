import { IResponse } from "@/app/shared/types/common";

interface ContactInfo {
  qtndHtNgonNguId: string;
  noiDung: string;
}

export interface IContactDetailResponse extends IResponse<ContactInfo> {}

export interface ContactFormBody {
  hoTen: string;
  email: string;
  noiDung: string;
  ip: string;
}

export interface IContactResponse extends IResponse<any> {}

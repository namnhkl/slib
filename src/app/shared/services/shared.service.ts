import { IBsThuvien } from '@/app/pages/home/HomeSearchAdvanced/type';
import { Injectable } from '@angular/core';
import { IResponse } from '../types/common';
import { DanhmucService } from './danhmuc.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public thuVienId: string = ''; 

  constructor(private danhmucService: DanhmucService) { }
   /**
   * Gọi API lấy thư viện và lưu thuVienId
   */
  initThuVien(): void {
    this.danhmucService.getThuvien().subscribe({
      next: (res: IResponse<IBsThuvien[]>) => {
        const thuVien = res?.data?.[0];
        if (thuVien) {
          this.thuVienId = thuVien.id;
          console.log('SharedService -> thuVienId:', this.thuVienId);
        } else {
          console.warn('Không có thư viện trong dữ liệu trả về.');
        }
      },
      error: (err) => {
        console.error('Lỗi khi gọi API thư viện:', err);
      }
    });
  }
}

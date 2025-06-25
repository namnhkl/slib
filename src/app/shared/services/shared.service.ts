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
  initThuVien(done?: () => void): void {
  this.danhmucService.getThuvien().subscribe({
    next: (res) => {
      const thuVien = res?.data?.[0];
      if (thuVien) {
        this.thuVienId = thuVien.id;
        // console.log('SharedService -> thuVienId:', this.thuVienId);
        localStorage.setItem('bs_thuvien_id', this.thuVienId);
        done?.(); // gọi callback nếu có
      }
    },
    error: (err) => {
      console.error('Lỗi khi gọi API thư viện:', err);
      done?.(); // vẫn gọi callback để tránh treo
    }
  });
}

}

import { Component, inject, OnInit } from '@angular/core';
import { FooterService } from './footer.service';
import { SharedService } from '../../services/shared.service';
import { IqtndTtLienHe } from './footer';
import { TranslateService, LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';
import { TienIchKhacService } from '../../services/tienichkhac';
import { CopyRight } from '../../types/tienichkhac';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class FooterComponent implements OnInit {
  appInfo = environment.appInfo;
  mathuvien = environment.MA_THU_VIEN;
  footerService = inject(FooterService);
  tienIchKhacService = inject(TienIchKhacService);
  sharedService = inject(SharedService);
  translateService = inject(TranslateService);

  IqtndTtLienHe: IqtndTtLienHe | undefined;
  copyRight: any | undefined;

  ngOnInit(): void {
    // Gọi 1 lần ban đầu
    this.getqtndTtLienHe();

    // Theo dõi khi đổi ngôn ngữ → tự gọi lại
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getqtndTtLienHe();
    });
  }

getqtndTtLienHe(): void {
  const thuVienId = this.sharedService.thuVienId;
  const langCode = this.translateService.currentLang;
  const langParam = this.mapLangToCode(langCode);

  console.log('Lang code:', langCode, '→ API param:', langParam);

  if (!thuVienId) {
    console.warn('Chưa có thư viện ID!');
    return;
  }

  this.footerService.getQtndTtLienHe(thuVienId, langParam).subscribe({
    next: (res) => {
      if (res.messageCode === 1) {
        this.IqtndTtLienHe = res.data?.[0];
        console.log('Thông tin liên hệ:', this.IqtndTtLienHe);
      } else {
        console.warn('Không lấy được thông tin liên hệ');
      }
    },
    error: (err) => {
      console.error('Lỗi khi lấy liên hệ:', err);
    }
  });

  this.tienIchKhacService.qtndQlFooterCopyright({ma:this.mathuvien, bsThuVienId:thuVienId,qtndHtNgonNguId:langParam }).subscribe({
    next: (res) => {
      console.log('res copyright',res);
      if (res.messageCode === 1) {
        this.copyRight = res.data;
        console.log('Copy right:', this.copyRight);
      } else {
        console.warn('Không lấy được thông tin Copyright');
      }
    },
    error: (err) => {
      console.error('Lỗi khi lấy Copyright:', err);
    }
  });
}

private mapLangToCode(lang: string): string {
  const mapping: { [key: string]: string } = {
    'vi-VN': '1',
    'en-US': '2',
  };
  return mapping[lang] || '1'; // Mặc định là '1' nếu không khớp
}

}

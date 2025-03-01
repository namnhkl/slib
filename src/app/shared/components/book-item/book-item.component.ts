import { Component, Input } from '@angular/core';
import { IBoook } from '../../types/common';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.scss'],
  standalone: false,
})
export class BookItemComponent {
  @Input() book: IBoook = {
    id: '',
    anhDaiDien: '',
    tieuDe: '',
    tacGia: [],
    thongTinXuatBan: '',
    slBanIn: 0,
    slBanSo: 0,
    slXem: 0,
    diemDanhGia: 0
  };
}

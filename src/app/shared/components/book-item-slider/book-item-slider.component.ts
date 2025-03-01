import { Component, Input } from '@angular/core';
import { IBoook } from '../../types/common';

@Component({
  selector: 'app-book-slider',
  templateUrl: './book-item-slider.component.html',
  styleUrls: ['./book-item-slider.component.scss'],
  standalone: false,
})
export class BookItemSliderComponent {
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

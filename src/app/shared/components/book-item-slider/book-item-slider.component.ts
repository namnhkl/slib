import { Component, Input } from '@angular/core';
import { IBoook } from '../../types/common';
import { get } from 'lodash';

@Component({
  selector: 'app-book-item-slider',
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
  getImageUrl(book: IBoook): string {
    //if book.anhDaiDien is null or undefined, return empty string
    if (!get(book, 'anhDaiDien')) {
      return 'https://placehold.co/170x220/EEE/31343C';
    }
    else{
      return book.anhDaiDien!;
    }
    //if book.anhDaiDien is not null or undefined, return book.anhDaiDien
  }
}

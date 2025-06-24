import { Component, Input } from '@angular/core';
import { IBoook } from '../../types/common';
import { get, has } from 'lodash';

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
    diemDanhGia: 0,
  };

  getImageUrl(book: IBoook): string {
    //if book.anhDaiDien is null or undefined, return empty string
    if (!get(book, 'anhDaiDien')) {
      return './assets/img/imageBook/book_default.svg';
    }
    else{
      return book.anhDaiDien!;
    }
    //if book.anhDaiDien is not null or undefined, return book.anhDaiDien
  }
}

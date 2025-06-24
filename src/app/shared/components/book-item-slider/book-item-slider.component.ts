import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { IBoook } from '../../types/common';
import { get } from 'lodash';

@Component({
  selector: 'app-book-item-slider',
  templateUrl: './book-item-slider.component.html',
  styleUrls: ['./book-item-slider.component.scss'],
  standalone: false,
})
export class BookItemSliderComponent implements AfterViewInit {
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
  @Input() className: string = 'item-class';
  @ViewChild('titleElement') titleElement: ElementRef | undefined;
  constructor(private renderer: Renderer2) {}
  getImageUrl(book: IBoook): string {
    //if book.anhDaiDien is null or undefined, return empty string
    if (!get(book, 'anhDaiDien')) {
      return './assets/img/imageBook/book_default.svg';
    } else {
      return book.anhDaiDien!;
    }
    //if book.anhDaiDien is not null or undefined, return book.anhDaiDien
  }

  ngAfterViewInit() {
    this.checkTitleHeight();
  }

  checkTitleHeight() {
    if (this.titleElement) {
      const element = this.titleElement.nativeElement;
      const lineHeight = parseInt(
        window.getComputedStyle(element).lineHeight,
        10
      );
      const height = element.offsetHeight;
      const lines = height / lineHeight;

      if (lines > 1) {
        this.renderer.addClass(element, 'item-title--over');
      }
    }
  }
}

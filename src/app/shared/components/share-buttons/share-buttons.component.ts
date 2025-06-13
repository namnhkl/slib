import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.css'],
  imports:[CommonModule,TranslateModule,NzToolTipModule ],
  standalone: true,
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class ShareButtonsComponent {
  @Input() url: string = '';
  @Input() title: string = '';
  @Input() showLabel: boolean = true;
    isShareOpen = true;
  constructor(
    private translate: TranslateService
  ) {}

  copyToClipboard() {
    navigator.clipboard.writeText(this.url).then(() => {
      alert(this.translate.instant('copied'));
    });
  }

encode(value: string): string {
  if (!value) return '';
  
  try {
    // Nếu giá trị decode rồi mà không đổi nghĩa là đã encode rồi
    const decoded = decodeURIComponent(value);
    if (decoded !== value) {
      return value; // đã encode rồi
    }
  } catch {
    // decode lỗi → chắc chắn đã encode rồi → không encode nữa
    return value;
  }

  // nếu chưa encode thì encode
  return encodeURIComponent(value);
}

toggleShareMenu() {
  this.isShareOpen = !this.isShareOpen;
}


}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ShareButtonsComponent } from '@/app/shared/components/share-buttons/share-buttons.component';
import { SharedService } from '@/app/shared/services/shared.service';
import { GioiThieuService } from '@/app/shared/services/gioithieu';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-gioi-thieu-chi-tiet',
  templateUrl: './gioi-thieu-chi-tiet.component.html',
  styleUrl: './gioi-thieu-chi-tiet.component.scss',
  providers: [],
  standalone:true,
  imports: [CommonModule,TranslateModule,ShareButtonsComponent,NzCardModule ],
})
export class GioiThieuChiTietComponent implements OnInit, AfterViewInit {
  newDetail: any = {};
  safeContent: SafeHtml = '';
  currentUrl: string = '';
  encodedUrl: string = '';
  encodedTitle: string = '';
  iframePermissions: string = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
 youtubeEmbedUrl: SafeResourceUrl | null = null;
  constructor(
    private gioiThieuService: GioiThieuService,
      private route: ActivatedRoute,
      private router: Router,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService
  ) {}
  ngAfterViewInit(): void {
   
  }
ngOnInit() {
  // console.log('id gt');
  this.route.queryParams.subscribe((params) => {
    const id = _.get(params, 'id', '');
    if (id.length > 0) {
      // console.log('id gt', id);
      this.gioiThieuService.qtndGioiThieuChiTiet({
        bsThuVienId: this.sharedService.thuVienId,
        id: id
      }).subscribe((res) => {
        // console.log('res GioiThieuChiTiet', res);
        if (res.messageCode === 1) {
          this.newDetail = _.get(res, 'data', {});
          // console.log('GioiThieuChiTiet', this.newDetail);
          const noiDungRaw = _.get(this.newDetail, 'noiDung', '');
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(noiDungRaw);
          this.currentUrl = window.location.href;
          this.encodedUrl = encodeURIComponent(this.currentUrl);
          this.encodedTitle = encodeURIComponent(this.newDetail?.ten ?? '');
        }
      });
    }
  });
}


  getYoutubeEmbedUrl(url: string): string {
    const sanitizedUrl = this.normalizeUrl(url);
    const match = sanitizedUrl.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return sanitizedUrl;
  }


getSafeVideoUrl(url: string): SafeResourceUrl {
  if (!url) return '';

  let sanitizedUrl = this.normalizeUrl(url);

  // Nếu là đường dẫn YouTube dạng watch?v=, thì chuyển sang embed/
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
  const match = sanitizedUrl.match(youtubeRegex);

  if (match && match[1]) {
    const videoId = match[1];
    sanitizedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
}


  normalizeUrl(url: string): string {
  return url
    .replace(/\\\\/g, '/')        
    .replace(/\\/g, '/')   
    .replace(/^https?:\/(?!\/)/, match => match + '/');
  }

  getSafeIframeHtml(url: string): SafeHtml {
  if (!url) return '';

  let sanitizedUrl = this.normalizeUrl(url);

  // Nếu là đường dẫn YouTube dạng watch?v=, thì chuyển sang embed/
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
  const match = sanitizedUrl.match(youtubeRegex);

  if (match && match[1]) {
    const videoId = match[1];
    sanitizedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  const iframeHtml = `
    <iframe
      src="${sanitizedUrl}"
      width="100%"
      height="500"
      frameborder="0"
      allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      class="w-full rounded-lg"
    ></iframe>`;

  return this.sanitizer.bypassSecurityTrustHtml(iframeHtml);
}

}

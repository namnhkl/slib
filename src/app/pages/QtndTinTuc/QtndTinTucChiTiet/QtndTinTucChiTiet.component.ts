import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { QtndTinTucService } from '../QtndTinTuc.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { QtndTinTucCarouselComponent } from '../qtndtintuc-carousel/qtndtintuc-carousel.component';
import { TinTucVideoSlideComponent } from '../qtndtintuc-video-slide/qtndtintuc-video-slide.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShareButtonsComponent } from '@/app/shared/components/share-buttons/share-buttons.component';

@Component({
  selector: 'app-details',
  templateUrl: './QtndTinTucChiTiet.component.html',
  styleUrl: './QtndTinTucChiTiet.component.scss',
  providers: [QtndTinTucService],
  imports: [CommonModule, TinTucVideoSlideComponent,QtndTinTucCarouselComponent,TranslateModule,ShareButtonsComponent],
})
export class QtndTinTucChiTietComponent implements OnInit, AfterViewInit {
  newDetail: any = {};
  safeContent: SafeHtml = '';
  currentUrl: string = '';
  encodedUrl: string = '';
  encodedTitle: string = '';
  iframePermissions: string = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
 youtubeEmbedUrl: SafeResourceUrl | null = null;
  constructor(
    private newService: QtndTinTucService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}
  ngAfterViewInit(): void {
   
  }

  ngOnInit() {

    this.router.params.subscribe((params) => {
      const id = _.get(params, 'id', '');
      if (id.length > 0) {
        this.newService.getNews({ id }).subscribe((res) => {
          if (res.messageCode === 1) {
            this.newDetail = _.get(res, 'data.0', {});
            const noiDungRaw = _.get(res, 'data.0.noiDung', '');
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(noiDungRaw);
            console.log('nd: ', this.safeContent);
            this.currentUrl = window.location.href;
            this.encodedUrl = encodeURIComponent(this.currentUrl);
            this.encodedTitle = encodeURIComponent(this.newDetail?.ten ?? '');

            if (this.newDetail.laTinVideo == 1 && this.newDetail.tepTin01DuongDan) {
  const embedUrl = this.getYoutubeEmbedUrl(this.newDetail.tepTin01DuongDan);
  this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
}

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

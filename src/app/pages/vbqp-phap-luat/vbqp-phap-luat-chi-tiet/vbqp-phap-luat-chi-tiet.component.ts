import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { VbqpPhapLuatService } from '../vbqp-phap-luat.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ShareButtonsComponent } from '@/app/shared/components/share-buttons/share-buttons.component';
import { SharedService } from '@/app/shared/services/shared.service';

@Component({
  selector: 'app-vbqp-phap-luat-chi-tiet',
  templateUrl: './vbqp-phap-luat-chi-tiet.component.html',
  styleUrl: './vbqp-phap-luat-chi-tiet.component.scss',
  providers: [VbqpPhapLuatService],
  imports: [CommonModule,TranslateModule,ShareButtonsComponent],
})
export class VbqpPhapLuatChiTietComponent implements OnInit, AfterViewInit {
  VbqpPhapLuatDetail: any = {};
  safeContent: SafeHtml = '';
  currentUrl: string = '';
  encodedUrl: string = '';
  encodedTitle: string = '';
  iframePermissions: string = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
 youtubeEmbedUrl: SafeResourceUrl | null = null;
  constructor(
    private VbqpPhapLuatService: VbqpPhapLuatService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService
  ) {}
  ngAfterViewInit(): void {
   
  }

  ngOnInit() {

    this.router.params.subscribe((params) => {
      const id = _.get(params, 'id', '');
      if (id.length > 0) {
        this.VbqpPhapLuatService.getVbqpPhapLuats({ id,bsThuvienId:this.sharedService.thuVienId }).subscribe((res) => {
          if (res.messageCode === 1) {
            this.VbqpPhapLuatDetail = _.get(res, 'data.0', {});
            console.log('VbqpPhapLuatDetail',this.VbqpPhapLuatDetail);
            const noiDungRaw = _.get(res, 'data.0.noiDung', '');
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(noiDungRaw);
            console.log('nd: ', this.safeContent);
            this.currentUrl = window.location.href;
            this.encodedUrl = encodeURIComponent(this.currentUrl);
            this.encodedTitle = encodeURIComponent(this.VbqpPhapLuatDetail?.ten ?? '');

            if (this.VbqpPhapLuatDetail.laTinVideo == 1 && this.VbqpPhapLuatDetail.tepTin01DuongDan) {
              const embedUrl = this.getYoutubeEmbedUrl(this.VbqpPhapLuatDetail.tepTin01DuongDan);
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

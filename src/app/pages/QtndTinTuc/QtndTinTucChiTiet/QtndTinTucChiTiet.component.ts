import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { QtndTinTucService } from '../QtndTinTuc.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { HomeVideosComponent } from '../../home/HomeVideos/HomeVideos.component';

@Component({
  selector: 'app-details',
  templateUrl: './QtndTinTucChiTiet.component.html',
  styleUrl: './QtndTinTucChiTiet.component.scss',
  providers: [QtndTinTucService],
  imports: [CommonModule, HomeVideosComponent],
})
export class QtndTinTucChiTietComponent implements OnInit {
  newDetail: any = {};
  safeContent: SafeHtml = '';
  
  constructor(
    private newService: QtndTinTucService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

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
          }
        });
      }
    });
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    // Replace \\ with / and sanitize
    const sanitizedUrl = this.normalizeUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
  }

  normalizeUrl(url: string): string {
  return url
    .replace(/\\\\/g, '/')        
    .replace(/\\/g, '/')   
    .replace(/^https?:\/(?!\/)/, match => match + '/');
  }
}

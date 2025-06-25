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
import { VbqpPhapLuatCarouselComponent } from '../vbqp-phap-luat-carousel/vbqp-phap-luat-carousel.component';

@Component({
  selector: 'app-vbqp-phap-luat-chi-tiet',
  templateUrl: './vbqp-phap-luat-chi-tiet.component.html',
  styleUrl: './vbqp-phap-luat-chi-tiet.component.scss',
  providers: [VbqpPhapLuatService],
  imports: [CommonModule,TranslateModule,ShareButtonsComponent,VbqpPhapLuatCarouselComponent],
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
        this.VbqpPhapLuatService.chiTietVanBan({ id,bsThuVienId:this.sharedService.thuVienId }).subscribe((res) => {
          if (res.messageCode === 1) {
            this.VbqpPhapLuatDetail = _.get(res, 'data.0', {});
            // console.log('VbqpPhapLuatDetail',this.VbqpPhapLuatDetail);
            const noiDungRaw = _.get(res, 'data.0.noiDung', '');
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(noiDungRaw);
            // console.log('nd: ', this.safeContent);
            this.currentUrl = window.location.href;
            this.encodedUrl = encodeURIComponent(this.currentUrl);
            this.encodedTitle = encodeURIComponent(this.VbqpPhapLuatDetail?.ten ?? '');
          }
        });
      }
    });
  }
}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ShareButtonsComponent } from '@/app/shared/components/share-buttons/share-buttons.component';
import { SharedService } from '@/app/shared/services/shared.service';
import { SachHayService } from '../sach-hay.service';
import { SachHayCarouselComponent } from '../sach-hay-carousel/sach-hay-carousel.component';

@Component({
  selector: 'app-sach-hay-chi-tiet',
  templateUrl: './sach-hay-chi-tiet.component.html',
  styleUrl: './sach-hay-chi-tiet.component.scss',
  providers: [SachHayService],
  imports: [CommonModule,SachHayCarouselComponent,TranslateModule,ShareButtonsComponent],
})
export class SachHayChiTietComponent implements OnInit, AfterViewInit {
  sachHayDetail: any = {};
  safeContent: SafeHtml = '';
  currentUrl: string = '';
  encodedUrl: string = '';
  encodedTitle: string = '';
  iframePermissions: string = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
 youtubeEmbedUrl: SafeResourceUrl | null = null;
  constructor(
    private sachHayService: SachHayService,
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
        this.sachHayService.getSachHayChiTiet({id:id, bsThuVienId:this.sharedService.thuVienId}).subscribe((res) => {
          if (res.messageCode === 1) {
            this.sachHayDetail = _.get(res, 'data.0', {});
            console.log('sachHayDetail',this.sachHayDetail);
            const noiDungRaw = _.get(res, 'data.0.noiDung', '');
            this.safeContent = this.sanitizer.bypassSecurityTrustHtml(noiDungRaw);
            console.log('nd: ', this.safeContent);
            this.currentUrl = window.location.href;
            this.encodedUrl = encodeURIComponent(this.currentUrl);
            this.encodedTitle = encodeURIComponent(this.sachHayDetail?.ten ?? '');
          }
        });
      }
    });
  }
}

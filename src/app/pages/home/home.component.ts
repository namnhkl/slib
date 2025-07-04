import { ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SeoService } from '@/app/core/services/seo/seo.service';
import { HomeSlidersComponent } from './HomeSliders/HomeSliders.component';
import { SharedModule } from '@/app/shared/shared.module';
import { HomeService } from './home.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { get } from 'lodash';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { HomeSearchAdvancedComponent } from './HomeSearchAdvanced/HomeSearchAdvanced.component';
import { LoaderService } from '@/app/shared/services/loader.service';
import { IBook, IBookSearchResponse } from './HomeSearchAdvanced/type';
import { stsBoSuuTapDsChuyenDeListComponent } from '@/app/pages/stsBoSuuTapDs-chuyen-de/stsBoSuuTapDs-chuyen-de-list/stsBoSuuTapDs-chuyen-de-list.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DanhmucService } from '@/app/shared/services/danhmuc.service';
import { environment } from 'environments/environment';
import {  TaiLieuService } from '../tai-lieu/tai-lieu.service';
import { IDocument } from '../tai-lieu/tai-lieu';
import { IResponse } from '@/app/shared/types/common';
import { QtndTinTucCarouselComponent } from '../QtndTinTuc/qtndtintuc-carousel/qtndtintuc-carousel.component';
import { RouterLink, RouterModule } from '@angular/router';
import { SharedService } from '@/app/shared/services/shared.service';
import { ChuyenDeSlideComponent } from '../stsBoSuuTapDs-chuyen-de/stsBoSuuTapDs-chuyen-de-slide/stsBoSuuTapDs-chuyen-de-slide.component';
import { TinTucVideoSlideComponent } from '../QtndTinTuc/qtndtintuc-video-slide/qtndtintuc-video-slide.component';
import { IChuyenDe } from '../stsBoSuuTapDs-chuyen-de/stsBoSuuTapDs-chuyen-de.type';
import { TinTucAudioSlideComponent } from '../QtndTinTuc/qtndtintuc-audio-slide/qtndtintuc-audio-slide.component';
import { SachHayCarouselComponent } from '../sach-hay/sach-hay-carousel/sach-hay-carousel.component';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    JsonPipe,
    SharedModule,
    HomeSlidersComponent,
    TinTucVideoSlideComponent,
    HomeSearchAdvancedComponent,
    TranslateModule,
    CommonModule,
    QtndTinTucCarouselComponent,
    RouterLink,
    RouterModule,
    ChuyenDeSlideComponent,
    TinTucAudioSlideComponent,
    SachHayCarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [HomeService, TaiLieuService],
  standalone:true
})
export class HomeComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    const content =
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const title = this.translate.instant('electronic_library_system');

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }

  homeService = inject(HomeService);
  danhmucService = inject(DanhmucService);
  documentService = inject(TaiLieuService);
  sharedService = inject(SharedService);
  dangtailieus: any[] = [];
  chuyendes: IChuyenDe[] = [];
  docsByType: { [id: string]: { id: string; ten: string; data: IBook[] } } = {};
  @ViewChild('default', { static: true }) defaultTemplate!: TemplateRef<any>;
  templateMap: { [key: string]: TemplateRef<any> } = {};

  allowedDangTaiLieu = environment.ALLOWED_DANG_TAI_LIEU;



  docs = this.homeService.getDocsLatest({bsThuvienId:this.sharedService.thuVienId}).pipe(
    switchMap((res) => {
      // console.log('🚀 ~ HomeComponent ~ switchMap ~ res:', res);
      if (res.messageCode === 1) return of(get(res, 'data', []));

      return [];
    })
  );


ngOnInit() {
  this.loaderService.setLoading(true);

  this.danhmucService.bmDmDangTaiLieu(this.sharedService.thuVienId).subscribe((res) => {
    // console.log('Danh mục:', res);
    this.dangtailieus = (res.data || []).filter(item => item && item.id);

    const requests = this.dangtailieus.map((item) =>
      this.documentService.bmTaiLieuDs({bsThuVienId: this.sharedService.thuVienId, bmDmDangTaiLieuId:item.id}).pipe(
        switchMap((res) => {
          const result = {
            id: String(item.id),
            ten: item.ten,
            data: res.messageCode === 1 && res.data ? res.data : []
          };
          // console.log('result list', result);
          return of(result);
        })
      )
    );

  forkJoin(requests).subscribe((results) => {
  const newDocsByType: { [id: string]: any } = {};
  results.forEach((r) => {
    newDocsByType[r.id] = r;
  });

  this.docsByType = newDocsByType;
  // Gán template default cho tất cả các dangtailieus
        this.templateMap = this.dangtailieus.reduce((map, dang) => {
          map[dang.id] = this.defaultTemplate;
          return map;
        }, {} as { [key: string]: TemplateRef<any> });
  this.changeDetectorRef.detectChanges();
  this.documentService.getChuyenDes(this.sharedService.thuVienId).subscribe(response => {
    this.chuyendes = response.data;  // Lấy đúng mảng IDocument[]
    // console.log('Chuyên đề: ', this.chuyendes);
  });


  this.loaderService.setLoading(false);
});

  });
}

  booksSearched: Partial<IBookSearchResponse> = {
    data: [],
    totalRecord: 10,
  };

  searchList(results: IBookSearchResponse) {
    this.booksSearched = results;
    this.changeDetectorRef.detectChanges();
  }

  getKey(id: any): string {
  return String(id);
}
}

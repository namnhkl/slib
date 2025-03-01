import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@/app/core/services/seo/seo.service';
import { HomeSlidersComponent } from './HomeSliders/HomeSliders.component';
import { SharedModule } from '@/app/shared/shared.module';
import { HomeService } from './home.service';
import { of, switchMap } from 'rxjs';
import { get } from 'lodash';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HomeCategoriesComponent } from './HomeCategories/HomeCategories.component';
import { HomeVideosComponent } from './HomeVideos/HomeVideos.component';
import { HomeSearchAdvancedComponent } from './HomeSearchAdvanced/HomeSearchAdvanced.component';
import { LoaderService } from '@/app/shared/services/loader.service';
import { IBookSearchResponse } from './HomeSearchAdvanced/type';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    JsonPipe,
    SharedModule,
    HomeCategoriesComponent,
    HomeSlidersComponent,
    HomeVideosComponent,
    HomeSearchAdvancedComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [HomeService],
})
export class HomeComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    const content =
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const title = 'Home Page';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }
  homeService = inject(HomeService);
  docs = this.homeService.getDocsLatest().pipe(
    switchMap((res) => {
      console.log('🚀 ~ HomeComponent ~ switchMap ~ res:', res);
      if (res.messageCode === 1) return of(get(res, 'data', []));

      return [];
    })
  );
  ngOnInit() {
    console.log('🚀 ~ HomeComponent ~ ngOnInit ~ HomeComponent');
    this.loaderService.setLoading(true);
  }

  booksSearched: Partial<IBookSearchResponse> = {
    data: [],
    totalRecord: 10,
  };

  searchList(results: IBookSearchResponse) {
    this.booksSearched = results;
    this.changeDetectorRef.detectChanges();
  }
}

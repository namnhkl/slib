import { Component, inject } from '@angular/core';
import { NewsService } from './news.service';
import { AsyncPipe } from '@angular/common';
import { of, switchMap, tap } from 'rxjs';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { RouterLink, RouterModule } from '@angular/router';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-news',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterModule,
    NzSpinModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  providers: [NewsService]
})
export class NewsComponent {
  isLoading = true;
  readonly URL_DETAIL = URL_ROUTER.newDetail;

  newService = inject(NewsService);

  news = this.newService.getNews().pipe(
    switchMap(res => {
      if (res.messageCode === 1) return of(_.get(res, 'data', []))
        
        return []
    })
  ).pipe(
    tap(() => {
      this.isLoading = false;
    })
  );

  // handleGoToDetails(event: any, _new: New) {
  //   event.preventDefault();
  //   console.log('new', _new);
  // }
}

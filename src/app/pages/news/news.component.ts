import { Component, inject } from '@angular/core';
import { NewsService } from './news.service';
import { AsyncPipe } from '@angular/common';
import { of, switchMap } from 'rxjs';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { RouterLink, RouterModule } from '@angular/router';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';

@Component({
  selector: 'app-news',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  providers: [NewsService]
})
export class NewsComponent {
  readonly URL_DETAIL = URL_ROUTER.newDetail;

  newService = inject(NewsService);

  news = this.newService.getNews().pipe(
    switchMap(res => {
      if (res.messageCode === 1) return of(_.get(res, 'data', []))

        return []
    })
  );

  // handleGoToDetails(event: any, _new: New) {
  //   event.preventDefault();
  //   console.log('new', _new);
  // }
}

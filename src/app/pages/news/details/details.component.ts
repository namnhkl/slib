import { Component, inject } from '@angular/core';
import _ from 'lodash';
import { switchMap, of } from 'rxjs';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-details',
  // imports: [
  //   AsyncPipe,
  //   JsonPipe
  // ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  providers: [NewsService],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class DetailsComponent {
    newService = inject(NewsService);

    newDetail = this.newService.getNews().pipe(
      switchMap(res => {
        if (res.messageCode === 1) return of(_.get(res, 'data.0', []))

          return []
      })
    );
}

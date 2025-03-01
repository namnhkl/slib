import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { NewsService } from '../news.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  providers: [NewsService],
  imports: [CommonModule],
})
export class DetailsComponent implements OnInit {
  newDetail: any;
  constructor(
    private newService: NewsService,
    private router: ActivatedRoute
  ) {}
  ngOnInit() {
    this.router.params.subscribe((params) => {
      // console.log(
      //   '🚀 ~ DetailsComponent ~ this.router.params.subscribe ~ params:',
      //   params
      // );
      const id = _.get(params, 'id', '');
      if (id.length > 0) {
        this.newService.getNews({ id }).subscribe((res) => {
          if (res.messageCode === 1) {
            this.newDetail = _.get(res, 'data.0', []);
          }
        });
      }
    });
  }
}

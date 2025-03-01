import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeSearchAdvancedComponent } from '../home/HomeSearchAdvanced/HomeSearchAdvanced.component';
import { IBookSearchResponse } from '../home/HomeSearchAdvanced/type';
import { map, tap } from 'rxjs';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { queryParamObject } from '@/app/shared/utils/queryParams';

@Component({
  selector: 'app-search-result',
  imports: [
    AsyncPipe,
    HomeSearchAdvancedComponent
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss'
})
export class SearchResultComponent {
  activatedRouter = inject(ActivatedRoute);

  pageIndex = 1;

  pageSize = 0;


  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.activatedRouter.queryParams
      .pipe(
        map(
          (queryParams: any) => ({
            pageIndex: Number(queryParams.pageIndex),
            pageSize: Number(queryParams.pageSize),
          })
        ),
        tap(value => {
          this.pageIndex = value.pageIndex;
          this.pageSize = value.pageSize;
        })
      ).subscribe()

  }

  booksSearched: Partial<IBookSearchResponse> = {
    data: [],
    totalRecord: 10
  }

  searchList(results: IBookSearchResponse) {
    this.booksSearched = results;
    this.changeDetectorRef.detectChanges()
  }

  handleChangePage(isBack?: boolean) {
    let newPage = this.pageIndex;

    if (isBack) {
      if (this.pageIndex === 1) return;
      newPage -= 1;
    } else {
      if (this.pageIndex === this.booksSearched.totalRecord) return;
      newPage += 1;
    }

    this.router.navigate([URL_ROUTER.searchResult], { queryParams: {
      ...queryParamObject(),
      pageIndex: newPage
    } })
  }

  handleChangePageSize(event: any) {
    this.router.navigate([URL_ROUTER.searchResult], { queryParams: {
      ...queryParamObject(),
      pageSize: event.target.value
    } })
  }
}

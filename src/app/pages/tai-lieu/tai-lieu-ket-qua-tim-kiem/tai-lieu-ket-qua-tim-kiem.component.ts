import { DEFAULT_PAGINATION_OPTIONS } from '@/app/shared/constants/const';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { SharedModule } from '@/app/shared/shared.module';
import { queryParamObject } from '@/app/shared/utils/queryParams';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { map, tap } from 'rxjs';
import { HomeSearchAdvancedComponent } from '../../home/HomeSearchAdvanced/HomeSearchAdvanced.component';
import { IBookSearchResponse } from '../../home/HomeSearchAdvanced/type';
import { DanhmucService } from '@/app/shared/services/danhmuc.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-result',
  imports: [
    HomeSearchAdvancedComponent,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzFormModule,
    NzRadioModule,
    NzIconModule,
    SharedModule,
    NzSelectModule,
    NzButtonModule,
    AsyncPipe,
    TranslateModule
  ],
  templateUrl: './tai-lieu-ket-qua-tim-kiem.component.html',
  styleUrl: './tai-lieu-ket-qua-tim-kiem.component.scss',
})
export class SearchResultComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
   danhMucService = inject(DanhmucService);
  pageSizes = DEFAULT_PAGINATION_OPTIONS;
  pageIndex = 0;
  pageTotal = 0;

  pageSize = 10;

  formCriteriaFilter: FormGroup;
  
  dangTaiLieus: any[] = []

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formCriteriaFilter = this.fb.group({
      bsThuVienId: this.fb.control(''),
      bmDmDangTaiLieuId: this.fb.control(''),
    });
  }

  handleClear(fieldName: string) {
    this.formCriteriaFilter.get(fieldName)?.setValue('')
  }


  getDangTaiLieu() {
    this.danhMucService.bmDmDangTaiLieu().subscribe((res) => {
      this.dangTaiLieus = res.data;
      console.log('dang tai lieu:', this.dangTaiLieus);
    });
  }

  ngOnInit() {
    this.getDangTaiLieu();
    this.activatedRouter.queryParams
      .pipe(
        map((queryParams: any) => ({
          pageIndex: Number(queryParams.pageIndex),
          pageSize: Number(queryParams.pageSize),
          bsThuVienId: queryParams.bsThuVienId,
          bmDmDangTaiLieuId: queryParams.bmDmDangTaiLieuId,
        })),
        tap((value) => {
          this.pageIndex = value.pageIndex;
          this.pageSize = value.pageSize;
          this.formCriteriaFilter.setValue({
            bsThuVienId: value.bsThuVienId || '',
            bmDmDangTaiLieuId: value.bmDmDangTaiLieuId || '',
          });
        })
      )
      .subscribe();
      //(booksSearched.totalRecord/pageSize)
    this.formCriteriaFilter.valueChanges.subscribe((value) => {
      this.booksSearched = value;
      this.router.navigate([URL_ROUTER.searchResult], {
        queryParams: {
          ...queryParamObject(),
          ..._.omitBy(value, !_.isUndefined),
        },
      });
    });
  }

  booksSearched: Partial<IBookSearchResponse> = {
    data: [],
    totalRecord: 10,
  };

  searchList(results: IBookSearchResponse) {
    this.booksSearched = results;
    this.pageTotal = Math.ceil(results.totalRecord / this.pageSize);
    this.changeDetectorRef.detectChanges();
  }

  handleChangePage(isBack?: boolean) {
    let newPage = this.pageIndex;
    if (isBack) {
      if (this.pageIndex === 0) return;
      newPage -= 1;
    } else {
      if (this.pageIndex === this.pageTotal - 1) return;
      newPage += 1;
    }

    this.router.navigate([URL_ROUTER.searchResult], {
      queryParams: {
        ...queryParamObject(),
        pageIndex: newPage,
      },
    });
  }

  handleChangePageSize(event: any) {
    this.router.navigate([URL_ROUTER.searchResult], {
      queryParams: {
        ...queryParamObject(),
        pageSize: event,
      },
    });
  }
}

import { DEFAULT_PAGINATION_OPTIONS } from '@/app/shared/constants/const';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { SharedModule } from '@/app/shared/shared.module';
import { queryParamObject } from '@/app/shared/utils/queryParams';
import { AsyncPipe, CommonModule } from '@angular/common';
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
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { forkJoin, map, tap } from 'rxjs';
import { HomeSearchAdvancedComponent } from '../../home/HomeSearchAdvanced/HomeSearchAdvanced.component';
import { IBookSearchResponse } from '../../home/HomeSearchAdvanced/type';
import { DanhmucService } from '@/app/shared/services/danhmuc.service';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { SharedService } from '@/app/shared/services/shared.service';
import { IBoSach } from '@/app/shared/types/danhmuc';

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
    TranslateModule,
    CommonModule
  ],
  templateUrl: './tai-lieu-ket-qua-tim-kiem.component.html',
  styleUrl: './tai-lieu-ket-qua-tim-kiem.component.scss',
})
export class SearchResultComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  danhMucService = inject(DanhmucService);
  pageSizes = environment.ITEM_PER_PAGE_OPTION;
  pageIndex = 0;
  pageTotal = 0;

  pageSize = environment.PAGE_SIZE;

  formCriteriaFilter: FormGroup;

  dangTaiLieus: any[] = []
  boSach: IBoSach[] = [];

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService
  ) {
    this.formCriteriaFilter = this.fb.group({
      bsThuVienId: [''],
      bmDmDangTaiLieuId: this.fb.control([]), // Cho phép nhiều
      bmTuDienBoSachId: this.fb.control([]),  // Cho phép nhiều
    });
  }

  handleClear(fieldName: string) {
    const control = this.formCriteriaFilter.get(fieldName);
    if (!control) return;

    const currentValue = control.value;

    if (Array.isArray(currentValue)) {
      control.setValue([]);
    } else {
      control.setValue('');
    }
  }



  getDangTaiLieu() {
    this.danhMucService.bmDmDangTaiLieu(this.sharedService.thuVienId).subscribe((res) => {
      this.dangTaiLieus = res.data;
    });
  }

  loadBoSach(thuVIenId: string) {
    this.danhMucService.getBoSach({ bsThuVienId: thuVIenId }).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.boSach = res.data;
          console.log('Bo sach:', this.boSach);
        } else {
          this.boSach = [];
        }
      },
      error: (err) => {
        this.boSach = [];
      }
    });
  }

  ngOnInit() {
    // Load đồng thời dangTaiLieus và boSach
     this.formCriteriaFilter.get('bmTuDienBoSachId')?.valueChanges.subscribe((val: string[]) => {
    if (Array.isArray(val) && val.length > 1) {
      // Giữ lại item cuối cùng (hoặc đầu tiên tùy yêu cầu)
      const lastSelected = val.slice(-1);
      this.formCriteriaFilter.get('bmTuDienBoSachId')?.setValue(lastSelected, { emitEvent: false });
    }
  });
    forkJoin({
      dangTaiLieus: this.danhMucService.bmDmDangTaiLieu(this.sharedService.thuVienId),
      boSach: this.danhMucService.getBoSach({ bsThuVienId: this.sharedService.thuVienId }),
    }).subscribe(({ dangTaiLieus, boSach }) => {
      this.dangTaiLieus = dangTaiLieus.data;
      this.boSach = boSach.data;

      // Sau khi dữ liệu đã có -> mới set form và xử lý query params
      this.activatedRouter.queryParams
        .pipe(
          map((queryParams: any) => {
  return {
    pageIndex: queryParams.pageIndex ? Number(queryParams.pageIndex) : 0,
    pageSize: queryParams.pageSize ? Number(queryParams.pageSize) : environment.PAGE_SIZE,
    bsThuVienId: this.sharedService.thuVienId,

    bmDmDangTaiLieuId: Array.isArray(queryParams.bmDmDangTaiLieuId)
      ? queryParams.bmDmDangTaiLieuId
      : typeof queryParams.bmDmDangTaiLieuId === 'string'
        ? queryParams.bmDmDangTaiLieuId.split(',').filter(Boolean)
        : [],

    bmTuDienBoSachId: Array.isArray(queryParams.bmTuDienBoSachId)
      ? queryParams.bmTuDienBoSachId
      : typeof queryParams.bmTuDienBoSachId === 'string'
        ? queryParams.bmTuDienBoSachId.split(',').filter(Boolean)
        : [],
  };
}),


          tap((value) => {
            this.pageIndex = value.pageIndex;
            this.pageSize = value.pageSize;

            this.formCriteriaFilter.patchValue({
              bsThuVienId: value.bsThuVienId,
              bmDmDangTaiLieuId: value.bmDmDangTaiLieuId,
              bmTuDienBoSachId: value.bmTuDienBoSachId,
            });

          })
        )
        .subscribe();

      // Lắng nghe thay đổi để cập nhật URL
      this.formCriteriaFilter.valueChanges.subscribe((value) => {
        this.booksSearched = value;

        this.router.navigate([URL_ROUTER.searchResult], {
          queryParams: {
            ...queryParamObject(),
            bmTuDienBoSachId: (value.bmTuDienBoSachId || []).join(','),
            bmDmDangTaiLieuId: (value.bmDmDangTaiLieuId || []).join(','),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          },
        });
      });
    });
  }

  booksSearched: Partial<IBookSearchResponse> = {
    data: [],
    totalRecord: environment.PAGE_SIZE,
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

  get canClearBoSach(): boolean {
    const val = this.formCriteriaFilter.get('bmTuDienBoSachId')?.value;
    return Array.isArray(val) && val.length > 0;
  }

  get canClearDangTaiLieu(): boolean {
    const val = this.formCriteriaFilter.get('bmDmDangTaiLieuId')?.value;
    return Array.isArray(val) && val.length > 0;
  }

}

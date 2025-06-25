import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HomeSearchAdvancedComponent } from '../home/HomeSearchAdvanced/HomeSearchAdvanced.component';
import { TaiLieuService } from './tai-lieu.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import _, { get } from 'lodash';
import { LoaderService } from '@/app/shared/services/loader.service';
import { SharedModule } from '@/app/shared/shared.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AsyncPipe } from '@angular/common';
import { map, tap } from 'rxjs';
import { queryParamObject } from '@/app/shared/utils/queryParams';
import { DEFAULT_PAGINATION_OPTIONS } from '@/app/shared/constants/const';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { IBookSearchResponse } from '../home/HomeSearchAdvanced/type';
import { DanhmucService } from '@/app/shared/services/danhmuc.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { SharedService } from '@/app/shared/services/shared.service';

@Component({
  selector: 'app-tai-lieu',
  templateUrl: './tai-lieu.component.html',
  styleUrls: ['./tai-lieu.component.scss'],
  imports: [
    HomeSearchAdvancedComponent,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NzSelectModule,
    SharedModule,
    NzInputModule,
    NzFormModule,
    NzRadioModule,
    NzIconModule,
    NzButtonModule,
    AsyncPipe,
    TranslateModule
  ],
  providers: [TaiLieuService],
})
export class TaiLieuComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  danhMucService = inject(DanhmucService);
  sharedService= inject(SharedService);
  documents: any[] = [];
  pageSizes = environment.PAGE_SIZE;
  sizeItems = environment.ITEM_PER_PAGE_OPTION;
  pageIndex = 0;
  pageTotal = 0;
  pageSize = environment.PAGE_SIZE;
  totalRecords = 0;
  totalPage = 0;

  dangTaiLieus: any[] = []

  formCriteriaFilter: FormGroup;
  constructor(
    private documentsService: TaiLieuService,
    private loaderService: LoaderService,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formCriteriaFilter = this.fb.group({
      bsThuVienId: [''],
      bmDmDangTaiLieuId: this.fb.control(''),
    });
  }
ngOnInit() {
  this.getDangTaiLieu();

  this.activatedRouter.queryParams
    .pipe(
      map((queryParams: any) => ({
        
        pageIndex: isNaN(Number(queryParams.pageIndex)) ? 0 : Number(queryParams.pageIndex),
        pageSize: isNaN(Number(queryParams.pageSize)) ? 10 : Number(queryParams.pageSize),
        bsThuVienId: this.sharedService.thuVienId,
        bmDmDangTaiLieuId: queryParams.bmDmDangTaiLieuId,
      })),
      tap((value) => {
        this.pageIndex = value.pageIndex;
        this.pageSize = value.pageSize;

        this.formCriteriaFilter.setValue({
          bsThuVienId: this.sharedService.thuVienId,
          bmDmDangTaiLieuId: value.bmDmDangTaiLieuId || '',
        }, { emitEvent: false });

        // ✅ GỌI API sau khi cập nhật form value từ query param
        this.loadDocuments();
      })
    )
    .subscribe();

  this.formCriteriaFilter.valueChanges.subscribe((value) => {
    this.booksSearched = value;
    this.router.navigate([URL_ROUTER.documents], {
      queryParams: {
        ...queryParamObject(),
        ..._.omitBy(value, _.isUndefined),
      },
    });

    // ✅ Gọi API sau khi navigate xong
    this.loadDocuments();
  });
}


  booksSearched: Partial<IBookSearchResponse> = {
    data: [],
    totalRecord: 10,
  };

  handleClear(fieldName: string) {
    this.formCriteriaFilter.get(fieldName)?.setValue('');
  }

  calcPageAndPageSize(event: any) {
    return `${event * this.pageSize}/${this.totalRecords}`;
  }

  changePageSize(event: number) {
    this.pageSize = event;
    this.pageIndex = 0; // Reset về trang đầu
    this.loadDocuments();
  }

  loadDocuments() {
  this.loaderService.setLoading(true);
  const { bmDmDangTaiLieuId } = this.formCriteriaFilter.value;
  // console.log('SharedService.thuVienId:', this.sharedService.thuVienId);
  this.documentsService.bmTaiLieuDs({
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
    bsThuVienId: this.sharedService.thuVienId,
    bmDmDangTaiLieuId
  }).subscribe((res) => {
    this.documents = res.data;
    this.totalRecords = parseInt(`${res.totalRecord}`) || 0;
    this.totalPage = Math.ceil(this.totalRecords / this.pageSize);
    this.loaderService.setLoading(false);
    this.changeDetectorRef.detectChanges();
  });
}



  getDangTaiLieu() {
    this.danhMucService.bmDmDangTaiLieu(this.sharedService.thuVienId).subscribe((res) => {
      this.dangTaiLieus = res.data;
      // console.log('dang tai lieu:', this.dangTaiLieus);
    });
  }

  nextPage() {
    if (this.pageIndex + 1 < this.totalPage) {
      this.pageIndex++;
      this.loadDocuments();
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadDocuments();
    }
  }

}

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HomeSearchAdvancedComponent } from '../home/HomeSearchAdvanced/HomeSearchAdvanced.component';
import { DocumentsService } from './documents.service';
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

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
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
  ],
  providers: [DocumentsService],
})
export class DocumentsComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  documents: any[] = [];
  pageSizes = DEFAULT_PAGINATION_OPTIONS;
  sizeItems = [10, 20, 30, 40, 50];
  pageIndex = 0;
  pageTotal = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPage = 0;
  formCriteriaFilter: FormGroup;
  constructor(
    private documentsService: DocumentsService,
    private loaderService: LoaderService,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formCriteriaFilter = this.fb.group({
      bsThuVienId: this.fb.control(''),
      bmDmDangTaiLieuId: this.fb.control(''),
    });
  }

  ngOnInit() {
    this.pageIndex = 10;
    this.documentsService.getDocsLatest().subscribe((res) => {
      console.log(
        '🚀 ~ DocumentsComponent ~ this.documentsService.getDocsLatest ~ res:',
        res
      );
      this.documents = res.data;
      this.totalRecords = parseInt(`${get(res, 'totalRecords', 0)}`);
      this.loaderService.setLoading(false);
    });
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
      this.router.navigate([URL_ROUTER.documents], {
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

  handleClear(fieldName: string) {
    this.formCriteriaFilter.get(fieldName)?.setValue('');
  }

  calcPageAndPageSize(event: any) {
    return `${event * this.pageSize}/${this.totalRecords}`;
  }

  changePageSize(event: number) {
    console.log('🚀 ~ DocumentsComponent ~ changePageSize ~ event:', event);
    this.pageSize = event;
    this.documentsService
      .getDocsLatest({
        pageSize: event,
        pageIndex: this.pageIndex,
      })
      .subscribe((res) => {
        this.documents = res.data;
      });
  }
}

import { DEFAULT_PAGINATION_OPTION } from '@/app/shared/constants/const';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { LoaderService } from '@/app/shared/services/loader.service';
import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { debounceTime, map, Observable, of, switchMap, tap } from 'rxjs';
import { HomeService } from '../home.service';
import { IBook } from './type';

@Component({
  selector: 'app-home-search-advanced',
  templateUrl: './HomeSearchAdvanced.component.html',
  styleUrls: ['./HomeSearchAdvanced.component.scss'],
  providers: [HomeService],
  imports: [
    NzButtonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzAutocompleteModule,
    AsyncPipe,
    NzDropDownModule,
  ],
})
export class HomeSearchAdvancedComponent implements OnInit {
  @Output() searchResultsChange = new EventEmitter();

  isVisibleHint = false;

  formAdvanceSearch: FormGroup;

  formBasicSearch: FormGroup;

  $options: Observable<IBook[]>;

  isVisible = false;

  activatedRouter = inject(ActivatedRoute);

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private homeService: HomeService,
    private loadingService: LoaderService
  ) {
    this.formAdvanceSearch = this.fb.group({
      tieuDe: this.fb.control(''),
      tacGia: this.fb.control(''),
      dinhDang: this.fb.control(''),
      nhaXuatBan: this.fb.control(''),
      ngonNgu: this.fb.control(''),
    });

    this.formBasicSearch = this.fb.group({
      tieuDe: this.fb.control(''),
    });

    this.$options = this.formBasicSearch.valueChanges.pipe(
      debounceTime(500),
      switchMap(({ tieuDe }) => {
        if (tieuDe.length >= 3) {
          return this.homeService.searchDocs({
            pageIndex: 0,
            pageSize: 10,
            tieuDe,
          });
        }

        return of(null);
      }),
      map((res) => _.get(res, 'data', [] as IBook[]))
    );
  }

  handleSelect(event: any) {
    console.log('event', event);
  }

  ngOnInit() {
    this.activatedRouter.queryParams
      .pipe(
        map((value: any) => ({
          formData: {
            tieuDe: _.get(value, 'tieuDe', ''),
            tacGia: _.get(value, 'tacGia', ''),
            dinhDang: _.get(value, 'dinhDang', ''),
            nhaXuatBan: _.get(value, 'nhaXuatBan', ''),
            ngonNgu: _.get(value, 'ngonNgu', ''),
          },
          queryPage: {
            pageIndex: Number(value.pageIndex) || 0,
            pageSize: Number(value.pageSize) || 10,
            bsThuVienId: value?.bsThuVienId || '',
            bmDmDangTaiLieuId: value?.bmDmDangTaiLieuId || '',
          },
        })),
        tap(({ formData }) => {
          this.loadingService.setLoading(true);
          this.formAdvanceSearch.setValue(formData);
          this.formBasicSearch.setValue({ tieuDe: formData.tieuDe });
        }),
        switchMap(({ formData, queryPage }) =>
          this.homeService.searchDocs({ ...formData, ...queryPage }).pipe(
            map((res) => ({
              data: _.get(res, 'data', [] as IBook[]),
              totalRecord: _.get(res, 'totalRecord', 0),
            })),
            tap(() => this.loadingService.setLoading(false))
          )
        )
      )
      .subscribe((searchList) => this.searchResultsChange.emit(searchList));
  }

  submitBasicSearch() {
    if (this.formBasicSearch.valid) {
      if (this.formBasicSearch.value.tieuDe.includes('auto-complete|')) {
        // console.log('please redirect to ' + this.formBasicSearch.value.tieuDe.replace('auto-complete|', ''))
        this.router.navigate([
          URL_ROUTER.documents,
          this.formBasicSearch.value.tieuDe.replace('auto-complete|', ''),
        ]);

        this.formBasicSearch.reset();

        return;
      }

      this.router.navigate([URL_ROUTER.searchResult], {
        queryParams: {
          ...this.formBasicSearch.value,
          ...DEFAULT_PAGINATION_OPTION,
        },
      });
    } else {
      Object.values(this.formBasicSearch.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitForm(): void {
    if (this.formAdvanceSearch.valid) {
      console.log('submit', this.formAdvanceSearch.value);
      this.router.navigate([URL_ROUTER.searchResult], {
        queryParams: {
          ...this.formAdvanceSearch.value,
          ...DEFAULT_PAGINATION_OPTION,
        },
      });
    } else {
      Object.values(this.formAdvanceSearch.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    this.isVisible = false;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  handleReset(): void {
    this.formAdvanceSearch.reset();
  }
}

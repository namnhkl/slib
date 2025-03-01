import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { HomeService } from '../home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { map, switchMap, tap } from 'rxjs';
import { IBook } from './type';
import { DEFAULT_PAGINATION_OPTION } from '@/app/shared/constants/const';
import _ from 'lodash';

@Component({
  selector: 'app-home-search-advanced',
  templateUrl: './HomeSearchAdvanced.component.html',
  styleUrls: ['./HomeSearchAdvanced.component.scss'],
  providers: [
    HomeService
  ],
  imports: [
    NzButtonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
})
export class HomeSearchAdvancedComponent implements OnInit {
  @Output() searchResultsChange = new EventEmitter();

  formAdvanceSearch: FormGroup;

  formBasicSearch: FormGroup;


  isVisible = false;

  activatedRouter = inject(ActivatedRoute);

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private homeService: HomeService
  ) {
    this.formAdvanceSearch = this.fb.group({
      tieuDe: this.fb.control(''),
      dinhDang: this.fb.control(''),
      nhaXuatBan: this.fb.control(''),
      ngonNgu: this.fb.control(''),
    });

    this.formBasicSearch = this.fb.group({
      tieuDe: this.fb.control('')
    })
  }

  ngOnInit() {
    this.activatedRouter.queryParams
      .pipe(
        map((value: any) => ({
          formData: {
            tieuDe: value.tieuDe,
            dinhDang: value.dinhDang || '',
            nhaXuatBan: value.nhaXuatBan || '',
            ngonNgu: value.ngonNgu || '',
          },
          queryPage: {
            pageIndex: Number(value.pageIndex),
            pageSize: Number(value.pageSize),
          }
        })),
        tap(({ formData }) => {
          this.formAdvanceSearch.setValue(formData);
          this.formBasicSearch.setValue({ tieuDe: formData.tieuDe });
        }),
        switchMap(({ formData, queryPage }) => {
          return this.homeService.searchDocs({ ...formData, ...queryPage })
            .pipe(
              map(res => {
                if (res.messageCode === 1 && _.isArray(res.data)) {
                  return {
                    data: _.get(res, 'data', [] as IBook[]),
                    totalRecord: _.get(res, 'totalRecord', 0)
                  }
                }

                return {
                  data: [] as IBook[],
                  totalRecord: 10
                }
              })
            );
        })
    ).subscribe((searchList) => {
      this.searchResultsChange.emit(searchList)
    })
  }

  submitBasicSearch() {
    if (this.formBasicSearch.valid) {
      this.router.navigate([URL_ROUTER.searchResult], {
        queryParams: {
          ...this.formBasicSearch.value,
          ...DEFAULT_PAGINATION_OPTION,
        }
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
        }
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

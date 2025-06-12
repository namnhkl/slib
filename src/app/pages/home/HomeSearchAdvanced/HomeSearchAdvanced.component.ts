import { DEFAULT_PAGINATION_OPTION } from '@/app/shared/constants/const';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { LoaderService } from '@/app/shared/services/loader.service';
import { AsyncPipe, CommonModule } from '@angular/common';
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
import { debounceTime, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { HomeService } from '../home.service';
import { IBook, IBsThuvien, IDangTaiLieu } from './type';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TaiLieuService } from '../../tai-lieu/tai-lieu.service';
import { Language } from '@/app/interfaces/language.interface';
import LanguageCodeJson from '@/app/utils/languagecode/LanguageCode.json';
import { DanhmucService } from '@/app/shared/services/danhmuc.service';
import { BsKho } from '@/app/interfaces/bskho.interface';
import { SharedService } from '@/app/shared/services/shared.service';

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
    TranslateModule,
    CommonModule
  ],
})
export class HomeSearchAdvancedComponent implements OnInit {
  @Output() searchResultsChange = new EventEmitter();

  isVisibleHint = false;
  languages: Language[] = [];

  formAdvanceSearch: FormGroup;

  formBasicSearch: FormGroup;

  $options: Observable<IBook[]>;

  isVisible = false;
  thuVIenId: string = '';
  thuVien: IBsThuvien | null = null;
  bsKhos: BsKho[] = [];
  dangTaiLieu: IDangTaiLieu[] = [];
  activatedRouter = inject(ActivatedRoute);

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private homeService: HomeService,
    private loadingService: LoaderService,
    private TaiLieuService: TaiLieuService,
    private translate: TranslateService,
    private  danhmucService: DanhmucService,
    private sharedService: SharedService
  ) {
    this.formAdvanceSearch = this.fb.group({
      tieuDe: this.fb.control(''),
      tacGia: this.fb.control(''),
      dkcb: this.fb.control(''),
      tuKhoa: this.fb.control(''),
      bsKhoId: this.fb.control(''),
      bmDmDangTaiLieuId: this.fb.control(''),
      phamVi: this.fb.control(''),
      nhaXuatBan: this.fb.control(''),
      ngonNgu: this.fb.control(''),
      bsThuVienId: [''],
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
            bsThuvienId: this.sharedService.thuVienId
          });
        }

        return of(null);
      }),
      map((res) => _.get(res, 'data', [] as IBook[]))
    );
  }

  handleSelect(event: any) {
    // console.log('event', event);
  }

filterLanguage = (search: string, item: any): boolean => {
  return item.nzLabel.toLowerCase().indexOf(search.toLowerCase()) !== -1;
};

loadLanguages(): void {
    // Chuyển đổi dữ liệu từ JSON thành mảng Language[]
    this.languages = Object.entries(LanguageCodeJson).map(([code, name]) => {
      return { code: code, name: name } as Language;
    });

    // Thêm các tùy chọn "Tất cả", "Tiếng Việt", "Tiếng Anh" vào đầu danh sách
    this.languages.unshift(
      { code: '', name: this.translate.instant('all') },
      { code: 'vie', name: this.translate.instant('vietnamese') },
      { code: 'eng', name: this.translate.instant('english') }
    );
}

loadBsKho(thuVIenId:string) {
  this.danhmucService.getKho(thuVIenId).subscribe({
    next: (res) => {
      if (res && res.data) {
          this.bsKhos = res.data;
        // console.log('Danh sách kho:', this.bsKhos);
      } else {
        this.bsKhos = [];
        // console.warn('Không có dữ liệu kho.');
      }
    },
    error: (err) => {
      // console.error('Lỗi khi tải danh sách kho:', err);
      this.bsKhos = [];
    }
  });
}

loadDangTaiLieu() {
  this.danhmucService.bmDmDangTaiLieu(this.sharedService.thuVienId).subscribe({
    next: (res) => {
      if (res && res.data) {
          this.dangTaiLieu = res.data;
      
      } else {
        this.dangTaiLieu = [];
   
      }
    },
    error: (err) => {
     
      this.dangTaiLieu = [];
    }
  });
}




  ngOnInit() {
   
    this.thuVIenId = this.sharedService.thuVienId;
    this.loadLanguages();
    this.loadBsKho(this.thuVIenId);
    this.loadDangTaiLieu();

    // Lắng nghe sự kiện thay đổi ngôn ngữ
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadLanguages(); // Cập nhật lại danh sách ngôn ngữ khi đổi ngôn ngữ
    });

this.activatedRouter.queryParams
  .pipe(
    map((value: any) => {
      const bsThuVienId = this.sharedService.thuVienId || '';

      return {
        formData: {
          tieuDe: _.get(value, 'tieuDe', ''),
          tacGia: _.get(value, 'tacGia', ''),
          phamVi: _.get(value, 'phamVi', ''),
          nhaXuatBan: _.get(value, 'nhaXuatBan', ''),
          ngonNgu: _.get(value, 'ngonNgu', ''),
          dkcb: _.get(value, 'ngonNgu', ''),
          tuKhoa: _.get(value, 'tuKhoa', ''),
          bsThuVienId: bsThuVienId,
          bsKhoId: _.get(value, 'bsKhoId', ''),
          bmDmDangTaiLieuId: _.get(value, 'bmDmDangTaiLieuId', ''),
        },
        queryPage: {
          pageIndex: Number(value.pageIndex) || 0,
          pageSize: Number(value.pageSize) || 10,
          bsThuVienId: bsThuVienId,
          bmDmDangTaiLieuId: value?.bmDmDangTaiLieuId || '',
        },
      };
    }),
    tap(({ formData }) => {
      this.loadingService.setLoading(true);
      this.formAdvanceSearch.setValue(formData); // bsThuVienId đã được thêm vào đây
      this.formBasicSearch.setValue({ tieuDe: formData.tieuDe });
    }),
    switchMap(({ formData, queryPage }) =>
      this.TaiLieuService.bmTaiLieuDs({ ...formData, ...queryPage }).pipe(
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
      // console.log('submit', this.formAdvanceSearch.value);
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
    // console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  handleReset(): void {
    this.formAdvanceSearch.reset();
  }
}

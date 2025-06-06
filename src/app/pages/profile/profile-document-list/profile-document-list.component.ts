import { AuthService } from '@/app/shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileDocumentItemComponent } from '../profile-document-item/profile-document-item.component';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '@/app/shared/shared.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { environment } from 'environments/environment';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-document-list',
  standalone: true,
  templateUrl: './profile-document-list.component.html',
  styleUrls: ['./profile-document-list.component.scss'],
  imports: [CommonModule, ProfileDocumentItemComponent, FormsModule,
    NzSelectModule,
    SharedModule,
    NzInputModule,
    NzFormModule,
    NzRadioModule,
    NzIconModule,
    NzButtonModule,
    TranslateModule,
    NzTabsModule],
})
export class ProfileDocumentListComponent implements OnInit {


  // Cấu hình page size và lựa chọn page size
  pageSizes = environment.PAGE_SIZE;
  sizeItems = environment.ITEM_PER_PAGE_OPTION;

  //Lịch sử mượn tài liệu in
  cirhistoryDocuments: any[] = [];
  cirhistoryPageIndex = 0;
  cirhistoryPageSize = this.pageSizes;
  cirhistoryTotalRecords = 0;
  cirhistoryTotalPage = 0;

  //Đang mượn tài liệu số
  cirhistoryDigitalDocuments: any[] = [];
  cirhistoryDigitalPageIndex = 0;
  cirhistoryDigitalPageSize = this.pageSizes;
  cirhistoryDigitalTotalRecords = 0;
  cirhistoryDigitalTotalPage = 0;

  // Borrowed Documents
  borrowedDocuments: any[] = [];
  borrowedPageIndex = 0;
  borrowedPageSize = this.pageSizes;
  borrowedTotalRecords = 0;
  borrowedTotalPage = 0;

  // Read Books
  readBooks: any[] = [];
  readPageIndex = 0;
  readPageSize = this.pageSizes;
  readTotalRecords = 0;
  readTotalPage = 0;

  // Favorite Documents
  favoriteDocuments: any[] = [];
  favoritePageIndex = 0;
  favoritePageSize = this.pageSizes;
  favoriteTotalRecords = 0;
  favoriteTotalPage = 0;

  tabs: any[] = [];
  private langChangeSub: Subscription | undefined;

  constructor(private authService: AuthService, private translate: TranslateService) { }
  initTabs(): void {
  const oldTabs = this.tabs;

  this.tabs = [
  {
    key: 'dangmuontailieuin',
    name: this.translate.instant('print_documents_borrowed'),
    icon: 'book',
    count: oldTabs?.find(t => t.key === 'dangmuontailieuin')?.count || 0
  },
  {
    key: 'lichsumuontailieuin',
    name: this.translate.instant('print_document_return_history'),
    icon: 'book',
    count: oldTabs?.find(t => t.key === 'lichsumuontailieuin')?.count || 0
  },
  {
    key: 'dangmuontailieuso',
    name: this.translate.instant('digital_documents_borrowed'),
    icon: 'read',
    count: oldTabs?.find(t => t.key === 'dangmuontailieuso')?.count || 0
  },
  {
    key: 'lichsumuontratailieuso',
    name: this.translate.instant('digital_document_return_history'),
    icon: 'read',
    count: oldTabs?.find(t => t.key === 'lichsumuontratailieuso')?.count || 0
  },
  {
    key: 'favorite',
    name: this.translate.instant('favorite_documents'),
    icon: 'star',
    count: oldTabs?.find(t => t.key === 'favorite')?.count || 0
  }
];

}

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.initTabs(); // Gọi khi khởi tạo

    // Lắng nghe khi ngôn ngữ thay đổi
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.initTabs(); // Cập nhật tabs khi đổi ngôn ngữ
    });
    this.loadBorrowedDocuments();
    this.loadReadBooks();
    this.loadFavoriteDocuments();
    this.loadCirHistoryItem();
    this.loadCirHistoryDigital();
  }

  // --- Đang mượn tài liệu in ---
  loadBorrowedDocuments() {
    this.authService.getBorrowedDocuments({
      pageIndex: this.borrowedPageIndex,
      pageSize: this.borrowedPageSize,
    }).subscribe((res: any) => {
      this.borrowedDocuments = res.data || [];
      this.borrowedTotalRecords = +res.totalRecord || 0;
      this.borrowedTotalPage = Math.ceil(this.borrowedTotalRecords / this.borrowedPageSize);
      this.tabs[0].count = res.totalRecord;
      console.log(res.data);
    });
  }

  changeBorrowedPageSize(size: number) {
    this.borrowedPageSize = size;
    this.borrowedPageIndex = 0;
    this.loadBorrowedDocuments();
  }

  prevBorrowedPage() {
    if (this.borrowedPageIndex > 0) {
      this.borrowedPageIndex--;
      this.loadBorrowedDocuments();
    }
  }

  nextBorrowedPage() {
    if (this.borrowedPageIndex + 1 < this.borrowedTotalPage) {
      this.borrowedPageIndex++;
      this.loadBorrowedDocuments();
    }
  }

  // --- Lịch sử mượn tài liệu in ---
  loadCirHistoryItem() {
    this.authService.getCirHistoryItem({
      pageIndex: this.cirhistoryPageIndex,
      pageSize: this.cirhistoryPageSize,
    }).subscribe((res: any) => {
      this.tabs[1].count = res.totalRecord;
      this.cirhistoryDocuments = res.data || [];
      this.cirhistoryTotalRecords = +res.totalRecord || 0;
      this.cirhistoryTotalPage = Math.ceil(this.cirhistoryTotalRecords / this.cirhistoryPageSize);

    });
  }

  changeCirHistoryPageSize(size: number) {
    this.cirhistoryPageSize = size;
    this.cirhistoryPageIndex = 0;
    this.loadCirHistoryItem();
  }

  prevCirHistoryPage() {
    if (this.cirhistoryPageIndex > 0) {
      this.cirhistoryPageIndex--;
      this.loadCirHistoryItem();
    }
  }

  nextCirHistoryPage() {
    if (this.cirhistoryPageIndex + 1 < this.cirhistoryTotalPage) {
      this.cirhistoryPageIndex++;
      this.loadCirHistoryItem();
    }
  }


  // --- Đang mượn tài liệu số ---
  loadCirHistoryDigital() {
    this.authService.getDangMuonTaiLieuSo({
      pageIndex: this.cirhistoryDigitalPageIndex,
      pageSize: this.cirhistoryDigitalPageSize,
    }).subscribe((res: any) => {
      this.cirhistoryDigitalDocuments = res.data || [];
      this.cirhistoryDigitalTotalRecords = +res.totalRecord || 0;
      this.cirhistoryDigitalTotalPage = Math.ceil(this.cirhistoryDigitalTotalRecords / this.cirhistoryDigitalPageSize);
      this.tabs[2].count = res.totalRecord;
    });
  }

  changecirhistoryDigitalPageSize(size: number) {
    this.cirhistoryDigitalPageSize = size;
    this.cirhistoryDigitalPageIndex = 0;
    this.loadCirHistoryDigital();
  }

  prevcirhistoryDigitalPage() {
    if (this.cirhistoryDigitalPageIndex > 0) {
      this.cirhistoryDigitalPageIndex--;
      this.loadCirHistoryDigital();
    }
  }

  nextcirhistoryDigitalPage() {
    if (this.cirhistoryDigitalPageIndex + 1 < this.cirhistoryDigitalTotalPage) {
      this.cirhistoryDigitalPageIndex++;
      this.loadCirHistoryDigital();
    }
  }

  // --- Lịch sử mượn trả tài liệu số ---
  loadReadBooks() {
    this.authService.countReadBooks({
      pageIndex: this.readPageIndex,
      pageSize: this.readPageSize,
    }).subscribe((res: any) => {
      this.readBooks = res.data || [];
      this.readTotalRecords = +res.totalRecord || 0;
      this.readTotalPage = Math.ceil(this.readTotalRecords / this.readPageSize);
      this.tabs[3].count = res.totalRecord;
    });
  }

  changeReadPageSize(size: number) {
    this.readPageSize = size;
    this.readPageIndex = 0;
    this.loadReadBooks();
  }

  prevReadPage() {
    if (this.readPageIndex > 0) {
      this.readPageIndex--;
      this.loadReadBooks();
    }
  }

  nextReadPage() {
    if (this.readPageIndex + 1 < this.readTotalPage) {
      this.readPageIndex++;
      this.loadReadBooks();
    }
  }

  // --- Favorite Documents ---
  loadFavoriteDocuments() {
    this.authService.getFavoriteDocuments({
      pageIndex: this.favoritePageIndex,
      pageSize: this.favoritePageSize,
    }).subscribe((res: any) => {
      this.favoriteDocuments = res.data || [];
      this.favoriteTotalRecords = +res.totalRecord || 0;
      this.favoriteTotalPage = Math.ceil(this.favoriteTotalRecords / this.favoritePageSize);
      this.tabs[4].count = res.totalRecord;
    });
  }

  changeFavoritePageSize(size: number) {
    this.favoritePageSize = size;
    this.favoritePageIndex = 0;
    this.loadFavoriteDocuments();
  }

  prevFavoritePage() {
    if (this.favoritePageIndex > 0) {
      this.favoritePageIndex--;
      this.loadFavoriteDocuments();
    }
  }

  nextFavoritePage() {
    if (this.favoritePageIndex + 1 < this.favoriteTotalPage) {
      this.favoritePageIndex++;
      this.loadFavoriteDocuments();
    }
  }
}

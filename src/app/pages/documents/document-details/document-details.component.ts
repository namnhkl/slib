import { SharedModule } from '@/app/shared/shared.module';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { get } from 'lodash';
import { of, switchMap } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { IDocument } from '../documents';
import { DocumentsService } from '../documents.service';
import { PreviewDocumentComponent } from '../preview-document/preview-document.component';
import { BookBorrowedComponent } from '../../../shared/components/book-borrowed/book-borrowed.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ProfileService } from '../../profile/profile.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
  imports: [
    RouterLink,
    CommonModule,
    NzToolTipModule,
    SharedModule,
    PreviewDocumentComponent,
    AsyncPipe,
    BookBorrowedComponent,
    NzModalModule,
    NzButtonModule,
    NzIconModule
  ],
  providers: [DocumentsService, HomeService],
  standalone:true
})
export class DocumentDetailsComponent implements OnInit {
  currentDocument!: IDocument;
  constructor(
    private router: ActivatedRoute,
    private documentsService: DocumentsService,
    private banDocsService: ProfileService,
    private changeRef: ChangeDetectorRef,
    private notification: NzNotificationService
  ) {}
  isVisible = false;
  homeService = inject(HomeService);
  docs = this.homeService.getDocsLatest().pipe(
    switchMap((res) => {
      if (res.messageCode === 1) return of(get(res, 'data', []));

      return [];
    })
  );

  getPropertyValue = (obj: any, path: string) => {
    return get(obj, path, false);
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      const id = get(params, 'id', '');
      if (id.length > 0) {
        this.documentsService.getDocsDetails(id).subscribe((res) => {
          console.log('res', res.data[0]);
          this.currentDocument = res.data[0];
          this.changeRef.detectChanges();
        });
      }
    });
  }

  toggleFavorite() {
    const newStatus = this.currentDocument.laTaiLieuQuanTam === 1 ? 0 : 1;
    const docId = this.currentDocument.id.toString(); // Đảm bảo truyền id dạng `string`
  
    if (newStatus === 1) {
      // Thêm yêu thích
      this.banDocsService.bdBanDocBmTaiLieuQuanTamThemMoi(docId)
        .subscribe({
          next: (res) => {
            this.currentDocument.laTaiLieuQuanTam = 1;
            this.createNotification("success","Thông báo","Đã thêm tài liệu vào danh sách yêu thích");
          },
          error: (err) => {
            this.createNotification("error","Thông báo","Lỗi khi bỏ yêu thích");
            console.error('Lỗi khi thêm yêu thích:', err);
          }
        });
    } else {
      // Bỏ yêu thích
      this.banDocsService.bdBanDocBmTaiLieuQuanTamXoa(docId)
        .subscribe({
          next: (res) => {
            this.currentDocument.laTaiLieuQuanTam = 0;
            this.createNotification("success","Thông báo","Đã loại bỏ tài liệu khỏi danh sách yêu thích");
          },
          error: (err) => {
            this.createNotification("error","Thông báo","Lỗi khi bỏ yêu thích");
            console.error('Lỗi khi bỏ yêu thích:', err);
          }
        });
    }
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
  
  createNotification(type: string,header: string, msg: string): void {
    this.notification.create(
      type,
      header,
      msg
    );
  }
  
}

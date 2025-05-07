import { SharedModule } from '@/app/shared/shared.module';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface TreeNode {
  id: string;
  tieuDe: string;
  tepTinTen: string; // Đường dẫn đến tệp gốc (có thể cần cho API convert)
  tepTinDinhDang: string; // .pdf, .mp3, .mp4, etc.
  tepTinHanChe: string; // "start-end" page cho PDF gốc
  cap: number;
  capMa: string;
  stsTaiLieuMucLucId: string;
  imageUrlsBase64?: string[]; // Mảng base64 cho các trang ảnh PDF
  startPage?: number; // Trang bắt đầu tương ứng với mục lục
}

interface PdfToBase64Response {
  data: { page: number; base64: string }[];
  messageCode: number;
  messageText: string;
  totalRecord: number;
}

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
  standalone: true
})
export class DocumentDetailsComponent implements OnInit {
  
  currentDocument!: IDocument;
  isVisible = false;
  treeStructure: TreeNode[] = [];
  selectedSection: TreeNode | null = null;
  currentContentUrl: SafeResourceUrl | null = null;
  currentPdfBase64Images: string[] = [];
  currentImageIndex: number = 0;
  convertingPdf: boolean = false;
  safeSrc: SafeResourceUrl | null = null; // Để lưu URL an toàn cho iframe
  homeService = inject(HomeService);
  docs = this.homeService.getDocsLatest().pipe(
    switchMap((res) => {
      if (res.messageCode === 1) return of(get(res, 'data', []));
      return [];
    })
  );

  constructor(
    private router: ActivatedRoute,
    private documentsService: DocumentsService,
    private banDocsService: ProfileService,
    private changeRef: ChangeDetectorRef,
    private notification: NzNotificationService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  getPropertyValue = (obj: any, path: string) => {
    return get(obj, path, false);
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      const id = get(params, 'id', '');
      if (id.length > 0) {
        this.documentsService.getDocsDetails(id).subscribe((res) => {
          this.currentDocument = res.data[0];
          this.changeRef.detectChanges();
        });
      }
    });
  }

  toggleFavorite() {
    const newStatus = this.currentDocument.laTaiLieuQuanTam === 1 ? 0 : 1;
    const docId = this.currentDocument.id.toString();

    if (newStatus === 1) {
      this.banDocsService.bdBanDocBmTaiLieuQuanTamThemMoi(docId)
        .subscribe({
          next: (res) => {
            this.currentDocument.laTaiLieuQuanTam = 1;
            this.createNotification("success", "Thông báo", "Đã thêm tài liệu vào danh sách yêu thích");
          },
          error: (err) => {
            this.createNotification("error", "Thông báo", "Lỗi khi yêu thích");
            console.error('Lỗi khi thêm yêu thích:', err);
          }
        });
    } else {
      this.banDocsService.bdBanDocBmTaiLieuQuanTamXoa(docId)
        .subscribe({
          next: (res) => {
            this.currentDocument.laTaiLieuQuanTam = 0;
            this.createNotification("success", "Thông báo", "Đã loại bỏ tài liệu khỏi danh sách yêu thích");
          },
          error: (err) => {
            this.createNotification("error", "Thông báo", "Lỗi khi bỏ yêu thích");
            console.error('Lỗi khi bỏ yêu thích:', err);
          }
        });
    }
  }

  showModal(): void {
    this.isVisible = true;
    const docId = "34e4bb7a-fec6-4ed6-bfd2-156108466d36";
    if (docId) {
      this.documentsService.stsTaiLieuChiTiet(docId, "0:0:0:1").subscribe({
        next: (res) => {
          console.log('Raw API response:', res);
          const firstDocument = res?.data?.[0];
          this.treeStructure = firstDocument?.stsTaiLieuMucDs || [];
          console.log('Data for list:', this.treeStructure);
          this.treeStructure.forEach(item => {
            if (item.tepTinDinhDang === '.pdf' && item.tepTinHanChe) {
              const [start, end] = item.tepTinHanChe.split('-').map(Number);
              item.startPage = start;
            }
          });

          if (this.treeStructure.length > 0) {
            this.selectSection(this.treeStructure[0]);
          } else {
            // ...
          }
        },
        error: (err) => {
          // ...
        }
      });
    }
  }
  

  selectSection(item: TreeNode): void {
    this.selectedSection = item;
    this.currentPdfBase64Images = [];
    this.currentContentUrl = null;
    this.currentImageIndex = 0;

    if (item.tepTinDinhDang === '.pdf' && item.tepTinTen) {
      this.convertingPdf = true;
      this.documentsService.convertPdfToBase64("https://www.cambridgeenglish.org/images/210434-converting-practice-test-scores-to-cambridge-english-scale-scores.pdf").subscribe({ // Gọi API convert
        next: (response: PdfToBase64Response) => {
          this.convertingPdf = false;
          if (response.messageCode === 1 && response.data) {
            this.currentPdfBase64Images = response.data.sort((a, b) => a.page - b.page).map(p => p.base64);
            if (item.startPage && this.currentPdfBase64Images.length > 0) {
              this.currentImageIndex = Math.max(0, item.startPage - 1);
            }
          } else {
            this.notification.error('Lỗi', 'Không thể tải hình ảnh PDF.');
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.convertingPdf = false;
          this.notification.error('Lỗi', 'Lỗi khi chuyển đổi PDF.');
          console.error('Lỗi convert PDF:', err);
          this.cdr.detectChanges();
        }
      });
    } else if (item.tepTinDinhDang === '.mp3') {
      this.currentContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.tepTinTen);
    } else if (item.tepTinDinhDang === '.mp4') {
      this.currentContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.tepTinTen);
    }
    this.cdr.detectChanges();
  }

  nextImage(): void {
    if (this.currentPdfBase64Images && this.currentImageIndex < this.currentPdfBase64Images.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage(): void {
    if (this.currentPdfBase64Images && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }


  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  createNotification(type: string, header: string, msg: string): void {
    this.notification.create(type, header, msg);
  }
}
import { SharedModule } from '@/app/shared/shared.module';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, Inject, PLATFORM_ID, NgZone } from '@angular/core';
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
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { DanhmucService } from '@/app/shared/services/danhmuc.service';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import type { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { PdfViewerModule } from 'ng2-pdf-viewer';

declare var $: any;

interface TreeNode {
  id: string;
  tieuDe: string;
  tepTinTen: string;
  tepTinDinhDang: string;
  tepTinHanChe: string;
  cap: number;
  capMa: string;
  stsTaiLieuMucLucId: string;
  imageUrlsBase64?: string[];
  startPage?: number;
  children?: TreeNode[];
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
    NzIconModule,
    NzSplitterModule,
    NzTreeModule,
    PdfViewerModule
  ],
  providers: [DocumentsService, HomeService],
  standalone: true,
})
export class DocumentDetailsComponent implements OnInit {
  currentDocument!: IDocument;
  isVisible = false;
  treeStructure: TreeNode[] = [];
  treeStructureDisplay: NzTreeNodeOptions[] = [];
  selectedSection: TreeNode | null = null;
  currentContentUrl: SafeResourceUrl | null = null;
  currentPdfBase64Images: string[] = [];
  currentImageIndex: number = 0;
  convertingPdf: boolean = false;
  safeSrc: SafeResourceUrl | null = null;
  homeService = inject(HomeService);
  docs = this.homeService.getDocsLatest().pipe(
    switchMap((res) => {
      if (res.messageCode === 1) return of(get(res, 'data', []));
      return [];
    })
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: ActivatedRoute,
    private documentsService: DocumentsService,
    private banDocsService: ProfileService,
    private danhmucService: DanhmucService,
    private changeRef: ChangeDetectorRef,
    private notification: NzNotificationService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  getPropertyValue = (obj: any, path: string) => {
    return get(obj, path, false);
  };

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
      this.banDocsService.bdBanDocBmTaiLieuQuanTamThemMoi(docId).subscribe({
        next: (res) => {
          this.currentDocument.laTaiLieuQuanTam = 1;
          this.createNotification('success', 'Thông báo', 'Đã thêm tài liệu vào danh sách yêu thích');
        },
        error: (err) => {
          this.createNotification('error', 'Thông báo', 'Lỗi khi yêu thích');
          console.error('Lỗi khi thêm yêu thích:', err);
        },
      });
    } else {
      this.banDocsService.bdBanDocBmTaiLieuQuanTamXoa(docId).subscribe({
        next: (res) => {
          this.currentDocument.laTaiLieuQuanTam = 0;
          this.createNotification('success', 'Thông báo', 'Đã loại bỏ tài liệu khỏi danh sách yêu thích');
        },
        error: (err) => {
          this.createNotification('error', 'Thông báo', 'Lỗi khi bỏ yêu thích');
          console.error('Lỗi khi bỏ yêu thích:', err);
        },
      });
    }
  }

  showModal(): void {
    this.isVisible = true;
    const docId = '34e4bb7a-fec6-4ed6-bfd2-156108466d36';
    if (docId) {
      this.documentsService.stsTaiLieuChiTiet(docId, '0:0:0:1').subscribe({
        next: (res) => {
          console.log('Raw API response:', res);
          const firstDocument = res?.data?.[0];
          this.treeStructure = firstDocument?.stsTaiLieuMucDs || [];
          console.log('Data for list:', this.treeStructure);

          // Build the tree structure
          this.treeStructure = this.buildTree(this.treeStructure);
          console.log('Built tree structure:', this.treeStructure); // Thêm dòng này để kiểm tra

          this.treeStructure.forEach((item) => {
            if (item.tepTinDinhDang === '.pdf' && item.tepTinHanChe) {
              const [start, end] = item.tepTinHanChe.split('-').map(Number);
              item.startPage = start;
            }
          });
          this.treeStructureDisplay = this.convertToAntdTreeData(this.treeStructure);
          console.log('Data for antd tree:', this.treeStructureDisplay);

          // Lấy key của node đầu tiên nếu có
        if (this.treeStructureDisplay.length > 0) {
          const firstNodeKey = this.treeStructureDisplay[0].key;
          // Gọi hàm onSelectTree một cách программно (programmatically)
          this.onSelectTree({ keys: [firstNodeKey], node: this.treeStructureDisplay[0] } as NzFormatEmitEvent);
        }
        },
        error: (err) => {
          // ...
        },
      });
    }
  }

  convertToAntdTreeData(nodes: TreeNode[]): NzTreeNodeOptions[] {
  return nodes.map((node) => {
    const antdNode: NzTreeNodeOptions = {
      title: node.tieuDe || 'Mục không tên',
      key: node.id,
      children: node.children && node.children.length > 0 ? this.convertToAntdTreeData(node.children) : [],
      isLeaf: !(node.children && node.children.length > 0),
    };
    console.log('Antd Node:', antdNode);
    return antdNode;
  });
}

  buildTree(nodes: TreeNode[], parentCapMa: string = ''): TreeNode[] {
  const result: TreeNode[] = [];
  const level = parentCapMa ? parentCapMa.length + 3 : 3;

  const filteredNodes = nodes.filter(node => node.capMa.length === level && node.capMa.startsWith(parentCapMa));

  filteredNodes.forEach(node => {
    const children = this.buildTree(nodes, node.capMa);
    result.push({
      ...node,
      children: children.length > 0 ? children : undefined, // Chỉ thêm children nếu có
    });
  });

  return result;
}

onSelectTree(event: NzFormatEmitEvent): void {
  console.log('Tree select event:', event);
  const selectedKey = event.keys?.[0]; // Truy cập keys từ event.keys
  console.log('selectedKey', selectedKey);
  if (selectedKey) {
    const selectedNode = this.findNodeByKey(this.treeStructure, selectedKey);
    console.log('Found Node:', selectedNode);
    if (selectedNode) {
      this.selectSection(selectedNode);
    }
  }
}

 findNodeByKey(nodes: TreeNode[], key: string): TreeNode | undefined {
  for (const node of nodes) {
    console.log('Checking Node:', node.id, 'against:', key);
    if (node.id === key) {
      return node;
    }
    if (node.children) {
      const found = this.findNodeByKey(node.children, key);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

  selectSection(item: TreeNode): void {
    console.log('selectSection called with:', item);
    this.selectedSection = item;
    this.currentPdfBase64Images = [];
    this.currentContentUrl = null;
    this.currentImageIndex = 0;

    if (item.tepTinDinhDang === '.pdf' && item.tepTinTen) {
      this.documentsService.stsTaiLieuMucLucChiTiet(item.id, '0:0:0:1').subscribe({
        next: (res) => {
          console.log('Raw API response for content:', res);
          const firstDocument = res?.data?.[0];
          let p = firstDocument?.tepTinDuLieu;

          if (p && p.length > 0) {
            p = decodeURIComponent(p);
            console.log('PDF URL:', p);
            this.danhmucService.getPdf(p).subscribe({
              next: (res: Blob) => {
                const file = new Blob([res], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                this.currentContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
              },
              error: (err) => {
                console.error('Lỗi khi tải PDF:', err);
              },
            });
          }
        },
        error: (err) => {
          console.error('Lỗi khi lấy chi tiết mục lục:', err);
        },
      });
    } else if (item.tepTinDinhDang === '.mp3' || item.tepTinDinhDang === '.mp4') {
  this.documentsService.stsTaiLieuMucLucChiTiet(item.id, '0:0:0:1').subscribe({
    next: (res) => {
      console.log('Raw API response for content:', res);
      const firstDocument = res?.data?.[0];
      let mediaUrl = firstDocument?.tepTinDuLieu;

      if (mediaUrl && mediaUrl.length > 0) {
        mediaUrl = decodeURIComponent(mediaUrl);
        console.log(`${item.tepTinDinhDang.toUpperCase()} URL:`, mediaUrl);

        // Nếu URL là hợp lệ, gán vào currentContentUrl để hiển thị trong audio/video tag
        this.currentContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mediaUrl);
      }
    },
    error: (err) => {
      console.error('Lỗi khi lấy chi tiết mục lục:', err);
    },
  });
}

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

  zoomLevel = 1.0;

zoomIn() {
  this.zoomLevel += 0.1;
}

zoomOut() {
  if (this.zoomLevel > 0.5) {
    this.zoomLevel -= 0.1;
  }
}
}
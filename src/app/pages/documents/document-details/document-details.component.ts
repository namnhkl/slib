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

interface TreeNode {
  id: string;
  tieuDe: string;
  tepTinTen: string;
  tepTinDinhDang: string;
  tepTinHanChe: string;
  cap: number;
  capMa: string;
  stsTaiLieuMucLucId: string;
  children?: TreeNode[];
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
    private notification: NzNotificationService
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
          const items = res?.data?.stsTaiLieuMucDs || res?.data || [];
          console.log('Items to build tree:', items);
          this.treeStructure = this.buildTree(items);
          console.log('Tree structure:', this.treeStructure);
          if (this.treeStructure.length > 0) {
            this.selectSection(this.treeStructure[0]);
          } else {
            console.warn('Tree structure is empty. Check input data or buildTree logic.');
            this.createNotification('warning', 'Cảnh báo', 'Không có dữ liệu mục lục để hiển thị.');
          }
        },
        error: (err) => {
          console.error('Error fetching document structure:', err);
          this.createNotification('error', 'Lỗi', 'Không thể tải cấu trúc tài liệu');
        }
      });
    }
  }

  buildTree(items: any[]): TreeNode[] {
    const tree: TreeNode[] = [];
    const map: { [key: string]: TreeNode } = {};

    if (!items || items.length === 0) {
      console.warn('No items provided to buildTree.');
      return tree;
    }

    // Initialize all nodes
    items.forEach(item => {
      if (!item.id) {
        console.warn('Item missing id:', item);
        return;
      }
      map[item.id] = {
        id: item.id,
        tieuDe: item.tieuDe || 'Mục không tên',
        tepTinTen: item.tepTinTen || '',
        tepTinDinhDang: item.tepTinDinhDang || '',
        tepTinHanChe: item.tepTinHanChe || '',
        cap: item.cap || 0,
        capMa: item.capMa || '',
        stsTaiLieuMucLucId: item.stsTaiLieuMucLucId || '0',
        children: []
      };
    });

    // Build the tree
    items.forEach(item => {
      if (!item.id) return;
      const node = map[item.id];
      if (item.stsTaiLieuMucLucId === "0" || !item.stsTaiLieuMucLucId) {
        tree.push(node);
      } else if (map[item.stsTaiLieuMucLucId]) {
        map[item.stsTaiLieuMucLucId].children!.push(node);
      } else {
        console.warn(`Parent not found for item with stsTaiLieuMucLucId: ${item.stsTaiLieuMucLucId}`, item);
        tree.push(node); // Fallback: add to root if parent not found
      }
    });

    // Sort children by cap and capMa
    const sortChildren = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.cap - b.cap || a.capMa.localeCompare(b.capMa));
      nodes.forEach(node => {
        if (node.children) {
          sortChildren(node.children);
        }
      });
    };
    sortChildren(tree);

    return tree;
  }

  selectSection(item: TreeNode): void {
    this.selectedSection = item;
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
import { SharedModule } from '@/app/shared/shared.module';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, Inject, PLATFORM_ID, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { get } from 'lodash';
import { of, switchMap } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { DsBanIn, IDanhSachTaiLieuDatMuonParams, IDocument } from '../tai-lieu';
import { TaiLieuService } from '../tai-lieu.service';
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
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AuthService } from '@/app/shared/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedService } from '@/app/shared/services/shared.service';
import { ShareButtonsComponent } from '@/app/shared/components/share-buttons/share-buttons.component';

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
  originDoc?: string;
}

interface PdfToBase64Response {
  data: { page: number; base64: string }[];
  messageCode: number;
  messageText: string;
  totalRecord: number;
}

@Component({
  selector: 'app-tai-lieu-chi-tiet',
  templateUrl: './tai-lieu-chi-tiet.component.html',
  styleUrls: ['./tai-lieu-chi-tiet.component.scss'],
  imports: [
    RouterLink,
    CommonModule,
    NzToolTipModule,
    SharedModule,
    AsyncPipe,
    BookBorrowedComponent,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzSplitterModule,
    NzTreeModule,
    NgxExtendedPdfViewerModule,
    TranslateModule,
    ShareButtonsComponent 
  ],
  providers: [TaiLieuService, HomeService, ],
  standalone: true,
})
export class TaiLieuChiTietComponent implements OnInit {
  @ViewChild('tomTatElement') tomTatElement!: ElementRef<HTMLParagraphElement>;
  isClamped: boolean = false;
  hasCheckedClamp = false;
  currentDocument!: IDocument;
  dkcbs: any;
  isVisible = false;
  isLogin = false;
  treeStructure: TreeNode[] = [];
  treeStructureDisplay: NzTreeNodeOptions[] = [];
  selectedSection: TreeNode | null = null;
  currentContentUrl: SafeResourceUrl | null = null;
  currentPdfBase64Images: string[] = [];
  currentImageIndex: number = 0;
  convertingPdf: boolean = false;
  safeSrc: SafeResourceUrl | null = null;
  dadatMuonTaiLieu: boolean = false;
  isEmptyDKCB: boolean = false;
  currentUrl: string = '';
  encodedUrl: string = '';
  isTomTatModalVisible = false;
  homeService = inject(HomeService);
  bandocService = inject(ProfileService);
  sharedService= inject(SharedService);

  docs = this.homeService.getDocsLatest({bsThuvienId: this.sharedService.thuVienId}).pipe(
    switchMap((res) => {
      if (res.messageCode === 1) return of(get(res, 'data', []));
      return [];
    })
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: ActivatedRoute,
    private documentsService: TaiLieuService,
    private banDocsService: ProfileService,
    private authService: AuthService,
    private danhmucService: DanhmucService,
    private changeRef: ChangeDetectorRef,
    private notification: NzNotificationService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private translate: TranslateService
  ) {}

ngAfterViewChecked() {
  if (
    this.currentDocument?.tomTat &&
    !this.hasCheckedClamp &&
    this.tomTatElement?.nativeElement
  ) {
    console.log('tomTatElement:', this.tomTatElement);
    this.checkClamp();
    this.hasCheckedClamp = true;
    this.cdr.detectChanges(); // cập nhật lại view
  }
}

  getPropertyValue = (obj: any, path: string) => {
    return get(obj, path, false);
  };

 getTrangThaiDatMuonTaiLieu(id: string) {
  const trimmedId = id.trim();
  const query: IDanhSachTaiLieuDatMuonParams = {
    bmTaiLieuId: trimmedId,
  };

if (this.currentDocument?.dsBanIn) {
  // Lọc trước: loại bỏ các item có trangThai = 20
  this.currentDocument.dsBanIn = this.currentDocument.dsBanIn.filter(item => item.trangThai !== 20);
}

// Sau khi lọc, kiểm tra dsBanIn tồn tại và không rỗng
if (!this.currentDocument?.dsBanIn || this.currentDocument.dsBanIn.length === 0) {
  this.isEmptyDKCB = true;
  this.cdr.detectChanges();
} else {
  this.isEmptyDKCB = false;
  this.cdr.detectChanges();
}


  this.banDocsService.bdBanDocLtDangKyMuonDs(query).subscribe(
    (res) => {
      if (res?.data?.length > 0) {
        const taiLieu = res.data.find(
          (x) => String(x.bmTaiLieuId).trim() === trimmedId
        );
        this.dadatMuonTaiLieu = !!taiLieu;
      } else {
        this.dadatMuonTaiLieu = false;
      }

      this.cdr.detectChanges(); // Buộc cập nhật giao diện
    },
    (error) => {
      console.error('Lỗi khi gọi API:', error);
      this.dadatMuonTaiLieu = false;
      this.cdr.detectChanges(); // Buộc cập nhật giao diện ngay cả khi lỗi
    }
  );
}

get isDisableDatMuon(): boolean {
  const ds = this.currentDocument?.dsBanIn;
  if (!ds || ds.length === 0) return true;
  return ds.filter(x => x.trangThai !== 20).length === 0;
}



datMuonTaiLieu() {
  this.documentsService.getDKCBs(this.sharedService.thuVienId, this.currentDocument.id,'','').subscribe((res) => {
    if (res.messageCode === 1) {
      this.dkcbs = res.data;
      console.log('dkcbs:', this.dkcbs);

      if (this.dkcbs && this.dkcbs.length > 0) {
        const dsId = this.dkcbs
          .filter((item: { laDatMuon: number }) => item.laDatMuon === 1)
          .map((item: { id: any }) => item.id);

        console.log('dkcb: ', dsId);
        console.log('docs: ', this.dkcbs);

        if (dsId.length === 0) {
          this.createNotification(
            'error',
            this.translate.instant('notification'),
            this.translate.instant('bdbandoc_khong_tim_thay_ban_in_duoc_phep_dat_muon')
          );
          return;
        }

        const randomIndex = Math.floor(Math.random() * dsId.length);
        const id = dsId[randomIndex];

        this.banDocsService.bdBanDocDangKyMuon(id).subscribe(
          (res) => {
            if (res.messageCode === 1) {
              this.createNotification(
                'success',
                this.translate.instant('notification'),
                this.translate.instant('bdbandoc_dat_muon_tai_lieu_thanh_cong')
              );
              this.getTrangThaiDatMuonTaiLieu(this.currentDocument.id);
            } else if (res.messageCode === 0) {
              this.createNotification(
                'error',
                this.translate.instant('notification'),
                res.messageText
              );
            } else {
              this.createNotification(
                'warning',
                this.translate.instant('notification'),
                this.translate.instant('error')
              );
            }
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Lỗi khi gọi API:', error);
            this.createNotification(
              'error',
              this.translate.instant('notification'),
              error
            );
            this.cdr.detectChanges();
          }
        );
      } else {
        this.createNotification(
          'error',
          this.translate.instant('notification'),
          this.translate.instant('bdbandoc_khong_tim_thay_danh_sach_ban_in')
        );
      }
    } else {
      this.createNotification(
        'error',
        this.translate.instant('notification'),
        this.translate.instant('bdbandoc_khong_lay_duoc_danh_sach_dkcb')
      );
    }
  });
}



huyDangKyDatMuon(id: string) {
  const query: IDanhSachTaiLieuDatMuonParams = { bmTaiLieuId: id };

  this.banDocsService.bdBanDocLtDangKyMuonDs(query).subscribe(
    (res) => {
      const taiLieu = res?.data?.find(x => x.bmTaiLieuId === id);
      if (taiLieu?.id) {
        this.banDocsService.bdBanDocDangKyMuonXoa(taiLieu.id).subscribe(
          (res) => {
            if (res.messageCode === 1) {
              this.createNotification(
                'success',
                this.translate.instant('notification'),
                this.translate.instant('bdbandoc_huy_dat_muon_tai_lieu_thanh_cong')
              );

              // ✅ Gọi lại API chi tiết tài liệu
              this.documentsService.getDocsDetails(id,this.sharedService.thuVienId).subscribe(
                (res) => {
                  if (res?.data) {
                    this.currentDocument = res.data[0];

                    // Cập nhật lại trạng thái đặt mượn
                    this.getTrangThaiDatMuonTaiLieu(id);

                    // Kiểm tra lại bản in hợp lệ
                    const dsValid = this.currentDocument.dsBanIn?.filter(x => x.trangThai !== 20) || [];
                    this.isEmptyDKCB = dsValid.length === 0;
                  }
                  this.cdr.detectChanges();
                },
                (err) => {
                  console.error('Lỗi khi gọi lại getDKCBs:', err);
                }
              );
            } else {
              this.createNotification('error', this.translate.instant('notification'), this.translate.instant('bdbandoc_khong_tim_thay_yeu_cau'));
            }
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Lỗi khi gọi API:', error);
            this.createNotification('error', this.translate.instant('notification'), this.translate.instant('error'));
            this.cdr.detectChanges();
          }
        );
      } else {
        this.createNotification('warning', this.translate.instant('notification'), this.translate.instant('error'));
        this.cdr.detectChanges();
      }
    },
    (error) => {
      console.error('Lỗi khi gọi API:', error);
      this.createNotification('error', this.translate.instant('notification'), this.translate.instant('error'));
      this.cdr.detectChanges();
    }
  );
}

ngOnInit() {
  this.router.params.subscribe((params) => {
    const id = get(params, 'id', '').trim();

    if (id.length > 0) {
      this.documentsService.getDocsDetails(id,this.sharedService.thuVienId).subscribe({
        next: (res) => {
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            this.currentDocument = res.data[0];
            this.hasCheckedClamp = false;
            console.log('data dc', this.currentDocument);
            this.currentUrl = window.location.href;
            this.encodedUrl = encodeURIComponent(this.currentUrl);
            // Kiểm tra trạng thái đặt mượn ngay sau khi nhận document
            if (this.currentDocument && this.currentDocument.id) {
              this.getTrangThaiDatMuonTaiLieu(this.currentDocument.id);
             
            }
            
            // Buộc Angular cập nhật giao diện
            this.cdr.detectChanges();
          } else {
            console.error('Dữ liệu trả về không hợp lệ hoặc rỗng:', res);
            // Xử lý trường hợp không có dữ liệu, ví dụ: hiển thị thông báo lỗi
          }
        },
        error: (err) => {
          console.error('Lỗi khi lấy chi tiết tài liệu:', err);
          // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        }
      });
    }
  });

  this.isLogin = this.authService.isAuthenticated;
}

checkClamp() {
  const el = this.tomTatElement?.nativeElement;
  if (!el) return;

  const style = getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight || '0');
  const maxHeight = lineHeight * 3;

  this.isClamped = el.scrollHeight >= maxHeight;
  console.log('👉 scrollHeight:', el.scrollHeight, 'maxHeight:', maxHeight, '=> isClamped:', this.isClamped);
}

  toggleFavorite() {
    const newStatus = this.currentDocument.laTaiLieuQuanTam === 1 ? 0 : 1;
    const docId = this.currentDocument.id.toString();

    if (newStatus === 1) {
      this.banDocsService.bdBanDocBmTaiLieuQuanTamThemMoi(docId).subscribe({
        next: (res) => {
          this.currentDocument.laTaiLieuQuanTam = 1;
          this.createNotification('success', this.translate.instant('notification'), this.translate.instant('added_document_to_favorites_list'));
        },
        error: (err) => {
          this.createNotification('error', this.translate.instant('notification'), this.translate.instant('error_when_liking'));
        },
      });
    } else {
      this.banDocsService.bdBanDocBmTaiLieuQuanTamXoa(docId).subscribe({
        next: (res) => {
          this.currentDocument.laTaiLieuQuanTam = 0;
          this.createNotification('success', this.translate.instant('notification'), this.translate.instant('removed_document_from_favorites_list'));
        },
        error: (err) => {
          this.createNotification('error', this.translate.instant('notification'), this.translate.instant('error_while_removing_favorites'));
        },
      });
    }
  }

  showModal(): void {
  // 👉 Reset modal trước khi xử lý
  this.isVisible = true;
  this.treeStructure = [];
  this.treeStructureDisplay = [];
  this.selectedSection = null;
  this.currentContentUrl = null;
  this.currentPdfBase64Images = [];
  this.currentImageIndex = 0;

  console.log("Current document:", this.currentDocument);

  const dsBanSo = this.currentDocument.dsBanSo;
  if (!dsBanSo || dsBanSo.length === 0) return;

  const allTreeData: TreeNode[] = [];
  let completedRequests = 0;

  dsBanSo.forEach((item) => {
    const docId = item.id.toString();

    this.documentsService.stsTaiLieuChiTiet(docId, '0:0:0:1',this.sharedService.thuVienId).subscribe({
      next: (res) => {
        const firstDocument = res?.data?.[0];
        const treePart = firstDocument?.stsTaiLieuMucDs || [];

        // Gắn docId và capMa duy nhất
        const adjustedTreePart = treePart.map(item => ({
          ...item,
          originDoc: docId,
          capMa: `${docId}_${item.capMa}`
        }));

        allTreeData.push(...adjustedTreePart);
        completedRequests++;

        if (completedRequests === dsBanSo.length) {
          this.treeStructure = this.buildTree(allTreeData);

          this.treeStructure.forEach((item) => {
            if (item.tepTinDinhDang === '.pdf' && item.tepTinHanChe) {
              const [start] = item.tepTinHanChe.split('-').map(Number);
              item.startPage = start;
            }
          });

          this.treeStructureDisplay = this.convertToAntdTreeData(this.treeStructure);
          console.log('Tree to display:', this.treeStructureDisplay);

          if (this.treeStructureDisplay.length > 0) {
            const firstNodeKey = this.treeStructureDisplay[0].key;
            this.onSelectTree({
              keys: [firstNodeKey],
              node: this.treeStructureDisplay[0],
            } as NzFormatEmitEvent);
          }
        }
      },
      error: (err) => {
        completedRequests++;
        console.error(`Error loading docId ${docId}:`, err);
      }
    });
  });
}



 convertToAntdTreeData(nodes: TreeNode[]): NzTreeNodeOptions[] {
  return nodes.map((node) => {
    const uniqueKey = `${node.originDoc}_${node.id}`;
    return {
      title: node.tieuDe || this.translate.instant('untitled_item'),
      key: uniqueKey,
      children: node.children ? this.convertToAntdTreeData(node.children) : [],
      isLeaf: !node.children || node.children.length === 0,
    };
  });
}


//   buildTree(nodes: TreeNode[], parentCapMa: string = ''): TreeNode[] {
//   const result: TreeNode[] = [];
//   const level = parentCapMa ? parentCapMa.length + 3 : 3;

//   const filteredNodes = nodes.filter(node => node.capMa.length === level && node.capMa.startsWith(parentCapMa));

//   filteredNodes.forEach(node => {
//     const children = this.buildTree(nodes, node.capMa);
//     result.push({
//       ...node,
//       children: children.length > 0 ? children : undefined, // Chỉ thêm children nếu có
//     });
//   });

//   return result;
// }

buildTree(nodes: TreeNode[], parentCapMa: string = ''): TreeNode[] {
  const result: TreeNode[] = [];

  const childrenNodes = nodes.filter(node => {
    const isDirectChild = node.capMa.startsWith(parentCapMa)
      && node.capMa.length === parentCapMa.length + 3;
    return parentCapMa === '' ? node.capMa.split('_')[1].length === 3 : isDirectChild;
  });

  childrenNodes.forEach(node => {
    const children = this.buildTree(nodes, node.capMa);
    result.push({
      ...node,
      children: children.length > 0 ? children : undefined
    });
  });

  return result;
}



// Trả về true nếu node là con trực tiếp của parentCapMa (tức không có node trung gian)
getImmediateChildCapMa(childCapMa: string, parentCapMa: string, allNodes: TreeNode[]): boolean {
  const intermediateLength = childCapMa.length;
  const expectedLength = parentCapMa.length + 3;

  if (intermediateLength !== expectedLength) return false;

  const intermediateParent = childCapMa.substring(0, expectedLength);
  return allNodes.every(n => {
    if (n.capMa.startsWith(parentCapMa) && n.capMa !== childCapMa) {
      return n.capMa.length !== expectedLength || !n.capMa.startsWith(intermediateParent);
    }
    return true;
  });
}

onSelectTree(event: NzFormatEmitEvent): void {
  const selectedKey = event.keys?.[0];
  if (selectedKey) {
    const selectedNode = this.findNodeByKey(this.treeStructure, selectedKey);
    if (selectedNode) {
      this.selectSection(selectedNode);
    }
  }
}

findNodeByKey(nodes: TreeNode[], key: string): TreeNode | undefined {
  for (const node of nodes) {
    const nodeKey = `${node.originDoc}_${node.id}`;
    if (nodeKey === key) return node;
    if (node.children) {
      const found = this.findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return undefined;
}


    selectSection(item: TreeNode): void {
  this.selectedSection = item;
  this.currentPdfBase64Images = [];
  this.currentContentUrl = null;
  this.currentImageIndex = 0;

  this.documentsService.stsTaiLieuMucLucChiTiet(item.id, '0:0:0:1', this.sharedService.thuVienId).subscribe({
    next: (res) => {
      const firstDocument = res?.data?.[0];
      let fileUrl = firstDocument?.tepTinDuLieu;

      if (fileUrl && fileUrl.length > 0) {
        fileUrl = decodeURIComponent(fileUrl);

        if (item.tepTinDinhDang === '.pdf') {
          this.danhmucService.getPdf(fileUrl).subscribe({
            next: (res: Blob) => {
              const file = new Blob([res], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              this.currentContentUrl = fileURL;
            }
          });
        } else if (item.tepTinDinhDang === '.mp3' || item.tepTinDinhDang === '.mp4') {
          this.currentContentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
        }
      }
    }
  });
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

  showLoginWarning() {
    this.createNotification('warning', this.translate.instant('you_are_not_logged_in'), this.translate.instant('please_login_to_use_this_function'));
  }


cleanText(text: string): string {
  return text?.trim().replace(/^[.,\s]+|[.,\s]+$/g, '');
}

openTomTatModal() {
  this.isTomTatModalVisible = true;
}


}
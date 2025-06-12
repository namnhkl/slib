import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { get } from 'lodash';
import { stsBoSuuTapDsChuyenDeService } from '../stsBoSuuTapDs-chuyen-de.service';
import { IChuyenDe, IChuyenDeResponse } from '../stsBoSuuTapDs-chuyen-de.type';
import { SortByCapPipe } from '../stsBoSuuTapDs-sort-by-cap.pipe';
import { LoaderService } from '@/app/shared/services/loader.service';
import { SeoService } from '@/app/core/services/seo/seo.service';
import { SafeHtmlPipe } from '@/app/shared/Pipes/safe-html.pipe';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateModule } from '@ngx-translate/core';
import { IDocument } from '@/app/pages/tai-lieu/tai-lieu';
import { ActivatedRoute } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { environment } from 'environments/environment';
import { SharedService } from '@/app/shared/services/shared.service';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { TaiLieuService } from '../../tai-lieu/tai-lieu.service';
import { BookItemSliderComponent } from '@/app/shared/components/book-item-slider/book-item-slider.component';
import { lastValueFrom } from 'rxjs';

interface TacGia {
  giaTri: string;
}

@Component({
  selector: 'app-chuyen-de-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AsyncPipe,
    SortByCapPipe,
    SafeHtmlPipe,
    NzCollapseModule,
    NzIconModule,
    NzPopoverModule,
    NzButtonModule,
    NzBadgeModule,
    NzModalModule,
    TranslateModule,
    NzSelectModule,
    NzTreeModule,
    
  ],
  templateUrl: './stsBoSuuTapDs-chuyen-de-detail.component.html',
  styleUrls: ['./stsBoSuuTapDs-chuyen-de-detail.component.scss'],
  providers: [stsBoSuuTapDsChuyenDeService,],
})
export class stsBoSuuTapDsChuyenDeDetailComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  @ViewChild('treeComponent', { static: false }) treeComponent!: NzTreeComponent;
  chuyenDeService = inject(stsBoSuuTapDsChuyenDeService);
  sharedService = inject(SharedService);
  documentService = inject(TaiLieuService);

  chuyenDe: IChuyenDe | null = null;
  chuyenDes: IChuyenDe[] = [];
  treeData: NzTreeNodeOptions[] = [];
  pageIndex = 0;
  pageSize = environment.PAGE_SIZE;
  itemPerpageOption = environment.ITEM_PER_PAGE_OPTION;
  totalRecord = 0;
  chuyendeId: string = '';
  documents: any[] = [];
  pageSizes = environment.PAGE_SIZE;
  sizeItems = environment.ITEM_PER_PAGE_OPTION;
  pageTotal = 0;
  totalRecords = 0;
  totalPage = 0;
  stsBoSuuTapId: string = '';
  selectedKeys: string[] = [];

 ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.chuyendeId = params['id'] || '';
    if (this.chuyendeId) {
      this.getChuyenDe(this.chuyendeId);
      this.getChuyenDeCon(this.chuyendeId);
      this.loadDocuments(this.chuyendeId);
    }
  });
}

getChuyenDe(sChuyenDeId?: string): void {
  if (!sChuyenDeId) return;
  this.chuyenDeService.getChuyenDeById({
    id: sChuyenDeId,
    bsThuvienId: this.sharedService.thuVienId
  }).subscribe({
    next: (response) => {
      // Giải nén từ response.data
      const data = response.data[0] || [];
      console.log('chuyende data: ', data);
      this.chuyenDe = data;
      this.changeDetectorRef.detectChanges();
    },
    error: (err) => {
      console.error('Lỗi lấy dữ liệu chuyên đề:', err);
    },
    complete: () => {
     
    }
  });
}


getChuyenDeCon(sChuyenDeId?: string): void {
  if (!sChuyenDeId) return;

  this.chuyenDeService.getChuyenDeList({
    bsThuvienId: this.sharedService.thuVienId
  }).subscribe({
    next: async (response) => {
      const allData: IChuyenDe[] = response.data || [];
      const result: IChuyenDe[] = [];

      // Đệ quy lấy chuyên đề con
      const findChildren = (parentId: string) => {
        const children = allData.filter(cd => cd.stsBoSuuTapId === parentId);
        for (const child of children) {
          if (!result.find(x => x.id === child.id)) {
            result.push(child);
            findChildren(child.id);
          }
        }
      };

      // Đệ quy lấy cha
      const parentChain = this.findParentChain(allData, sChuyenDeId);

      result.push(...parentChain.filter(p => !result.find(x => x.id === p.id)));

      findChildren(sChuyenDeId); // lấy các con của chuyên đề

      // Bỏ trùng
      const fullList = result.filter(
        (item, index, self) => index === self.findIndex(t => t.id === item.id)
      );

      this.chuyenDes = fullList;
      const rootId = parentChain.length > 0 ? parentChain[0].stsBoSuuTapId || null : null;

      this.treeData = await this.convertToTree(fullList, rootId);
      this.changeDetectorRef.detectChanges();

      setTimeout(() => {
      this.setActiveNodeByKey(this.chuyendeId);
    }, 100); // chỉ cần delay nhẹ
    },
    error: (err) => {
      console.error('Lỗi lấy dữ liệu chuyên đề:', err);
    }
  });
}

async convertToTree(data: IChuyenDe[], parentId: string | null = null): Promise<NzTreeNodeOptions[]> {
  const filtered = data.filter(item => item.stsBoSuuTapId === parentId);

  const nodes = await Promise.all(filtered.map(async (item) => {
    const children = await this.convertToTree(data, item.id);
    const hasChildren = children.length > 0;

    // Gọi API đếm số lượng
    let count = 0;
    try {
      const res = await lastValueFrom(
        this.chuyenDeService.getChuyenDeItem({
          stsBoSuuTapId: item.id,
          bsThuvienId: this.sharedService.thuVienId
        })
      );
      count = parseInt(`${res.totalRecord}`) || 0;
    } catch (err) {
      console.error('Lỗi khi lấy số lượng:', err);
    }

    return {
      title: `${item.ten} (${count})`,
      key: item.id,
      // expanded: hasChildren,
      isLeaf: !hasChildren,
      children: hasChildren ? children : undefined
    };
  }));

  return nodes;
}



findParentChain(allData: IChuyenDe[], id: string): IChuyenDe[] {
  const result: IChuyenDe[] = [];
  let current = allData.find(x => x.id === id);

  while (current) {
    result.unshift(current);
    current = allData.find(x => x.id === current?.stsBoSuuTapId || '');
  }

  return result;
}


onTreeNodeClick(event: NzFormatEmitEvent): void {
  const node = event.node;

  if (!node) return;

  const id = node.key; // id của chuyên đề
  this.stsBoSuuTapId = node.key;
  this.loadDocuments(this.stsBoSuuTapId);
  this.changeDetectorRef.detectChanges();
}

changePageSize(event: number) {
    this.pageSize = event;
    this.pageIndex = 0; // Reset về trang đầu
    this.loadDocuments(this.stsBoSuuTapId);
  }

loadDocuments(stsBoSuuTapId: string) {
  this.loaderService.setLoading(true);
  this.stsBoSuuTapId = stsBoSuuTapId;

  this.chuyenDeService.getChuyenDeItem({
    stsBoSuuTapId: stsBoSuuTapId,
    bsThuvienId: this.sharedService.thuVienId,
    pageIndex: this.pageIndex,
    pageSize: this.pageSize
  }).subscribe((res) => {
    this.documents = res.data;
    this.totalRecords = parseInt(`${res.totalRecord}`) || 0;
    this.totalPage = Math.ceil(this.totalRecords / this.pageSize);

    this.loaderService.setLoading(false);
    this.changeDetectorRef.detectChanges();
  });
}



setActiveNodeByKey(key: string): void {
  if (!this.treeComponent) return;
 console.log('key',key);
  this.selectedKeys = [key];
  this.changeDetectorRef.detectChanges(); // ✅ Kích hoạt CSS highlight
 console.log('keys',this.selectedKeys);
  const node = this.treeComponent.getTreeNodeByKey(key);
  if (node) {
    node.isExpanded = true; // ✅ Mở node cha nếu cần

    // ✅ Scroll đến node
    setTimeout(() => {
      const el = document.querySelector(`[title="${node.title}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}

 nextPage() {
    if (this.pageIndex + 1 < this.totalPage) {
      this.pageIndex++;
      this.loadDocuments(this.stsBoSuuTapId);
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadDocuments(this.stsBoSuuTapId);
    }
  }

}
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  Component, EventEmitter, OnDestroy, OnInit, Output,
} from '@angular/core';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
  NzDropDownModule,
} from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  NzFormatEmitEvent,
  NzTreeModule,
  NzTreeNode,
} from 'ng-zorro-antd/tree';
import { DataDynamicCategoryCreateComponent } from '@/app/pages/categories/data-dynamic-category/components/create-data/create-data.component';
import { DataDynamicCategoryUpdateComponent } from '@/app/pages/categories/data-dynamic-category/components/update-data/update-data.component';
import { CategoriesService } from '@/app/pages/categories/data-dynamic-category/services/index.service';
import { DEFAULT_PAGINATION_OPTION, TYPE_MES } from '@/app/shared/constants/const';
import { _dynamic } from '@/app/shared/models/dynamic';
import { CommonService } from '@/app/shared/services/common.service';
import { MemberService } from '@/app/shared/services/member.service';
import { SharedModule } from '@/app/shared/shared.module';
import { TriggerCollapseComponent } from '../trigger-collapse/trigger-collapse.component';
import { PermissionDataService } from '@/app/pages/system/role/services/permissionDatas.service';
import { CategoryColumnService } from '@/app/pages/categories/data-dynamic-category/services/categoryColumn.service';
import { CategoryDatasService } from '@/app/pages/categories/data-dynamic-category/services/categoryDatas.service';
import { TreeNodeNestedMenu } from '@/app/shared/types/treeNode';

interface TreeNode {
  title: string;
  key: string;
  id: string;
  name: string;
  code: string;
  isChecked: boolean;
  categoryCode: string;
  expanded?: boolean;
  isLeaf?: boolean;
  isRoute?: boolean;
  children?: TreeNode[];
}
@Component({
  selector: 'app-member-menubar',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    NzDropDownModule,
    NzIconModule,
    NzTreeModule,
    TriggerCollapseComponent,
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
})
export class MenubarComponent implements OnInit, OnDestroy {
  isCollapsed = false;

  @Output() dataEvent = new EventEmitter<boolean>();

  parentCategoryCode: string = '';

  menuModels: TreeNodeNestedMenu[] = [];

  roleId: string = '';

  fields: any;

  nodes = [];

  constructor(
    private categoriesService: CategoriesService,
    private categoryColumnService: CategoryColumnService,
    private categoryDatasService: CategoryDatasService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private commonService: CommonService,
    public memberService: MemberService,
    private nzContextMenuService: NzContextMenuService,
    private permissionDataService: PermissionDataService,
  ) {
  }

  ngOnInit() {
    this.getData();
    this.memberService.reloadTree$.subscribe((res) => {
      if (res) {
        this.getData();
      }
    });
  }

  ShowHideSider(isCollaps: any) {
    this.isCollapsed = isCollaps;
    this.dataEvent.emit(this.isCollapsed);
  }

  // ngOnDestory() {
  //   this.roleId = '';
  //   // Call the base class's ngOnDestroy method
  //   super.ngOnDestroy();
  // }

  ngOnDestroy(): void {
    this.roleId = '';
    this.categoriesService.stop();
    this.categoryColumnService.stop();
    this.categoryDatasService.stop();
    this.commonService.stop();
    this.memberService.stop();
    this.permissionDataService.stop();
  }

  getData() {
    this.permissionDataService
      .getDataTree()
      .subscribe((data) => {
        this.nodes = this.mapFlatToTree(data);
      });
  }

  handleClickNode(data: NzFormatEmitEvent): void {
    if (data.node) {
      this.memberService.nodeSubject = data.node as any;
    }
  }

  handleClickOpenContextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    if (this.memberService.activeNode) {
      this.nzContextMenuService.create($event, menu);
    }
  }

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const { node } = data;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  getAllItemsExpanded(nodes: TreeNode[]): string[] {
    const result: string[] = [];
    nodes.forEach((node) => {
      if (node.expanded) {
        result.push(node.key);
      }
      if (node.children && node.children.length > 0) {
        result.push(...this.getAllItemsExpanded(node.children));
      }
    });
    return result;
  }

  buildTree(data: any[], parentId: string | null = null, listExpanded: string[] = []): TreeNode[] {
    return data
      .filter((item) => item.parentId === parentId)
      .map((item) => {
        return {
          title: item.name,
          name: item.name,
          key: item.id,
          id: item.id,
          code: item.code,
          isChecked: item.isChecked,
          categoryCode: item.categoryCode,
          expanded: listExpanded.includes(item.id),
          isLeaf: !data.some((child) => child.parentId === item.id),
          isRoute: item.categoryCode === _dynamic.getValue('QUAN_LY_TUYEN'),
          children: this.buildTree(data, item.id, listExpanded),
          permissionValue: item.permissionValue,
        };
      });
  }

  mapFlatToTree(menuItems: TreeNodeNestedMenu[]) {
    let expandedItems: string[] = [];
    if (this.nodes && this.nodes.length) {
      expandedItems = this.getAllItemsExpanded(this.nodes);
    }
    const tree = this.buildTree(menuItems, null, expandedItems);
    const root = [
      {
        id: _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM'),
        key: _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM'),
        categoryCode: _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM'),
        code: _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM'),
        title: 'Cục địa chất Việt Nam',
        expanded: true,
        children: tree,
      },
    ];

    return root as any;
  }

  addRoute() {
    let categoryCode = '';
    switch (this.memberService.activeNode?.origin?.['categoryCode']) {
      case _dynamic.getValue('QUAN_LY_DE_AN'):
        categoryCode = _dynamic.getValue('QUAN_LY_DU_AN');
        break;
      case _dynamic.getValue('QUAN_LY_DU_AN'):
        categoryCode = _dynamic.getValue('DIEU_TRA_DANH_GIA');
        break;
      case _dynamic.getValue('DIEU_TRA_DANH_GIA'):
        categoryCode = _dynamic.getValue('QUAN_LY_TUYEN');
        break;
      case _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM'):
        categoryCode = _dynamic.getValue('QUAN_LY_TUYEN');
        break;
      default:
        categoryCode = _dynamic.getValue('QUAN_LY_TUYEN');
        break;
    }
    if (this.memberService.activeNode?.origin['categoryCode'] === _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM')) {
      const param = {
        ...DEFAULT_PAGINATION_OPTION,
        categoryCode: _dynamic.getValue('QUAN_LY_DE_AN'),
      };
      this.categoryColumnService.getColumnByCategory(param).subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            const fields = res.body.items.filter(
              (word: any) => word.code !== 'Id',
            );
            this.fields = fields;
            const data = {
              categoryCode: _dynamic.getValue('QUAN_LY_DE_AN'),
              parentCategoryCode: _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM'),
              columns: fields,
            };
            const modal: NzModalRef = this.modalService.create({
              nzTitle: 'Thêm mới Đề Án',
              nzContent: DataDynamicCategoryCreateComponent,
              nzData: data,
              nzWidth: '50%',
              nzFooter: null,
            });
            modal.afterClose.subscribe((result) => {
              if (result) {
                this.notification.create(
                  this.commonService.getStausByCode(result.code),
                  'Thông báo',
                  result.message,
                );
              }
            });
          }
        },
        (error) => {
          this.notification.create(
            TYPE_MES.error,
            'Thông báo',
            'Có lỗi xảy ra',
          );
          console.error('Request failed with error:', error);
        },
      );
    } else {
      if (categoryCode === _dynamic.getValue('QUAN_LY_TUYEN')) {
        this.memberService.activeTabs = 1;
        return;
      }

      const param = {
        ...DEFAULT_PAGINATION_OPTION,
        categoryCode,
      };
      this.categoryColumnService.getColumnByCategory(param).subscribe(
        (res1: HttpResponse<any>) => {
          if (res1.status === 200) {
            const fields = res1.body.items.filter(
              (word: any) => word.code !== 'Id',
            );
            let name = '';
            this.categoriesService.getByCode(categoryCode).subscribe(
              (res2: HttpResponse<any>) => {
                if (res2.status === 200) {
                  if (res2.body.data !== null) {
                    name = res2.body.data.name;
                    const data = {
                      categoryCode,
                      parentCategoryCode:
                        this.memberService.activeNode?.origin['categoryCode'],
                      columns: fields,
                      parentCode: this.memberService.activeNode?.origin['code'],
                      Code: `${this.memberService.activeNode?.origin['code']}.`,
                      Status: 'Y',
                    };

                    const modal: NzModalRef = this.modalService.create({
                      nzTitle: `Thêm mới ${name}`,
                      nzContent: DataDynamicCategoryCreateComponent,
                      nzData: data,
                      nzWidth: '50%',
                      nzFooter: null,
                    });
                    modal.afterClose.subscribe((result) => {
                      if (result) {
                        this.notification.create(
                          this.commonService.getStausByCode(result.code),
                          'Thông báo',
                          result.message,
                        );
                        this.getData();
                      }
                    });
                  }
                }
              },
              (error) => {
                this.notification.create(
                  TYPE_MES.error,
                  'Thông báo',
                  'Có lỗi xảy ra',
                );
                console.error('Request failed with error:', error);
              },
            );
          }
        },
        (error) => {
          this.notification.create(
            TYPE_MES.error,
            'Thông báo',
            'Có lỗi xảy ra',
          );
          console.error('Request failed with error:', error);
        },
      );
    }
  }

  editRoute() {
    if (this.memberService.activeNode?.origin['categoryCode'] === _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM')) {
      this.categoryDatasService
        .getDataById(this.memberService.activeNode?.origin.id)
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.status === 200) {
              const data = {
                categoryCode: _dynamic.getValue('QUAN_LY_DE_AN'),
                parentCategoryCode: _dynamic.getValue('QUAN_LY_DE_AN'),
                columns: this.fields,
                categoryData: res.body.data,
              };
              const modal: NzModalRef = this.modalService.create({
                nzTitle: 'Cập nhật dữ liệu',
                nzContent: DataDynamicCategoryUpdateComponent,
                nzData: data,
                nzWidth: '60%',
                nzFooter: null,
              });

              modal.afterClose.subscribe((result) => {
                if (result) {
                  this.notification.create(
                    this.commonService.getStausByCode(result.code),
                    'Thông báo',
                    result.message,
                  );
                }
              });
            }
          },
          (error) => {
            this.notification.create(
              TYPE_MES.error,
              'Thông báo',
              'Có lỗi xảy ra',
            );
            console.error('Request failed with error:', error);
          },
        );
    } else {
      const param = {
        ...DEFAULT_PAGINATION_OPTION,
        categoryCode: this.memberService.activeNode?.origin['categoryCode'],
      };
      this.categoryColumnService.getColumnByCategory(param).subscribe(
        (res1: HttpResponse<any>) => {
          if (res1.status === 200) {
            const fields = res1.body.items.filter(
              (word: any) => word.code !== 'Id',
            );
            const code = this.memberService.activeNode?.origin['categoryCode'];
            if (!code) return;
            this.categoriesService
              .getByCode(code)
              .subscribe(
                (res2: HttpResponse<any>) => {
                  if (res2.status === 200) {
                    if (res2.body.data !== null) {
                      this.categoryDatasService
                        .getDataById(this.memberService.activeNode?.origin['id'])
                        .subscribe(
                          (res3: HttpResponse<any>) => {
                            if (res3.status === 200) {
                              const data = {
                                categoryCode:
                                  this.memberService.activeNode?.origin['categoryCode'],
                                parentCategoryCode:
                                  res2.body.data.parentCategoryCode,
                                columns: fields,
                                categoryData: res3.body.data,
                              };
                              const modal: NzModalRef = this.modalService.create({
                                nzTitle: 'Cập nhật dữ liệu',
                                nzContent: DataDynamicCategoryUpdateComponent,
                                nzData: data,
                                nzWidth: '60%',
                                nzFooter: null,
                              });

                              modal.afterClose.subscribe((result) => {
                                if (result) {
                                  this.notification.create(
                                    this.commonService.getStausByCode(
                                      result.code,
                                    ),
                                    'Thông báo',
                                    result.message,
                                  );
                                  this.getData();
                                }
                              });
                            }
                          },
                          (error) => {
                            this.notification.create(
                              TYPE_MES.error,
                              'Thông báo',
                              'Có lỗi xảy ra',
                            );
                            console.error('Request failed with error:', error);
                          },
                        );
                    }
                  }
                },
                (error) => {
                  this.notification.create(
                    TYPE_MES.error,
                    'Thông báo',
                    'Có lỗi xảy ra',
                  );
                  console.error('Request failed with error:', error);
                },
              );
          }
        },
        (error) => {
          this.notification.create(
            TYPE_MES.error,
            'Thông báo',
            'Có lỗi xảy ra',
          );
          console.error('Request failed with error:', error);
        },
      );
    }
  }

  deleteRoute() {
    if (this.memberService.data) {
      const targetName = this.memberService.data.name;
      const targetNumber = 2;
      let noticeWarning = `Bạn có chắc chắn muốn xóa - <b>${targetName}</b>? <br>`;

      if (this.memberService.data.children && this.memberService.data.children.length > 0) {
        if (this.memberService.data.children.length > targetNumber) {
          const childTitles = this.memberService.data.children
            .filter((_, idx) => idx < targetNumber)
            .map((item) => item.title)
            .join(', ');
          noticeWarning += `Hành động này sẽ xóa vĩnh viễn đề mục này và tất cả các mục con của nó, bao gồm: <b>${childTitles},...</b> và các mục khác.<br> Hành động này không thể hoàn tác!`;
        } else {
          const childTitles = this.memberService.data.children
            .map((item) => item.title)
            .join(', ');
          noticeWarning += `Hành động này sẽ xóa vĩnh viễn đề mục này và tất cả các mục con của nó, bao gồm: <b>${childTitles}</b>.<br> Hành động này không thể hoàn tác!`;
        }
      } else {
        noticeWarning += 'Đề mục này không có mục con.';
      }

      this.modalService.confirm({
        nzTitle: `<b style="font-size: 24px;">Xóa ${this.memberService.activeNode?.origin['name']}?</b>`,
        nzContent: noticeWarning,
        nzCancelText: 'Hủy',
        nzOkText: 'Đồng ý',
        nzOnOk: () => {
          this.categoryDatasService
            .deleteData(this.memberService.activeNode?.origin['id'])
            .subscribe(
              (res: HttpResponse<any>) => {
                if (this.commonService.checkStausByCode(res.status)) {
                  this.notification.create(
                    TYPE_MES.success,
                    'Thông báo',
                    'Xóa thành công',
                  );
                  this.getData();
                } else {
                  this.notification.create(
                    TYPE_MES.error,
                    'Thông báo',
                    res.body.message,
                  );
                }
              },
              (error) => {
                this.notification.create(
                  TYPE_MES.error,
                  'Thông báo',
                  'Có lỗi xảy ra',
                );
                console.error('Request failed with error:', error);
              },
            );
        },
        nzOnCancel: () => {},
      });
    }
  }

  cloneData() {
    this.modalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: `Bạn có chắc chắn muốn nhân bản - [${this.memberService.activeNode?.origin['name']}]?`,
      nzCancelText: 'Hủy',
      nzOkText: 'Đồng ý',
      nzOnOk: () => {
        this.categoryDatasService
          .categoryDataClone(this.memberService.activeNode?.origin['id'])
          .subscribe(
            () => {
              this.notification.create(
                TYPE_MES.success,
                'Thông báo',
                'Nhân bản thành công',
              );
              this.getData();
            },
            (error) => {
              this.notification.create(
                TYPE_MES.error,
                'Thông báo',
                'Có lỗi xảy ra',
              );
              console.error('Request failed with error:', error);
            },
          );
      },
      nzOnCancel: () => {},
    });
  }
}

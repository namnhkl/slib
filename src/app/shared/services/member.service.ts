import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  delay,
  iif,
  map,
  mergeMap,
  Observable,
  of,
  skipWhile,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import _ from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Permission } from '../models/user/permission';
import { ActiveNode, ActiveNodeInLeftMenu } from '../types/treeNode';
import { CategoryNode } from '../models/tree-views/CategoryNode';
import { TYPE_MES } from '../constants/const';
import { _dynamic } from '../models/dynamic';
import { LoaderService } from './loader.service';
import { CategoryDatasService } from '@/app/pages/categories/data-dynamic-category/services/categoryDatas.service';
import { CategoryDataServicePreload } from '@/app/pages/categories/data-dynamic-category/services/preload.service';

/**
 * A Behavior subject is a special kind of RxJS subject that
 * - Stores the most recent value.
 * - Allows subscribers to access the most recent value immediately upon subscribing.
 */
@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private _reloadTree: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _activeTabs: BehaviorSubject<number> = (
    new BehaviorSubject<number>(0)
  );

  private _permission = new Permission();

  private _nodeSubject = (
    new BehaviorSubject<ActiveNodeInLeftMenu>({} as any)
  );

  public activeNode: ActiveNodeInLeftMenu | undefined;

  public data: ActiveNode | undefined;

  public categoryController: CategoryNode | undefined = undefined;

  destroyed = new Subject();

  informationActiveNode: any = null;

  constructor(
    private notification: NzNotificationService,
    private loadingService: LoaderService,
    private categoryDataService: CategoryDatasService,
    private categoryDataServicePreload: CategoryDataServicePreload,
  ) {
    this._nodeSubject.subscribe((value) => {
      this.activeNode = value;
    });
    this.initInformationActiveNode$().subscribe((res) => {
      this.informationActiveNode = res;
    });
  }

  stop() {
    console.info('member service stop?');
  }

  get nodeSubject$(): Observable<ActiveNodeInLeftMenu> {
    return this._nodeSubject.asObservable().pipe(
      tap(
        (value) => {
          this.activeNode = value;
        },
      ),
      tap(() => {
        this.data = this.getData();
        if (_.isNumber(this.data?.permissionValue)) {
          this._permission.checkPermission(this.data.permissionValue);
          this.categoryController = new CategoryNode(this.data?.categoryCode);
        }
      }),
      skipWhile(() => !_.isString(this.data?.id)),
      takeUntil(this.destroyed),
    );
  }

  set nodeSubject(value: ActiveNodeInLeftMenu) {
    this._nodeSubject.next(value);
  }

  getData(): ActiveNode | undefined {
    return _.get(this.activeNode, 'origin', undefined);
  }

  /**
   * Initializes the component by subscribing to the `nodeSubject$` observable from `memberService`.
   *
   * The observable pipeline performs the following operations:
   * - Toggles the loading state.
   * - Switches to a new observable that fetches
   *  category data details based on the node's origin ID.
   * - Merges the results to either initialize
   * data for the root node or a normal node based on the category code.
   * - Handles errors by displaying a notification and logging the error to the console.
   * - Toggles the loading state again.
   *
   * On successful completion, initializes the component data and enables edit mode.
   */
  initInformationActiveNode$() {
    return this.nodeSubject$.pipe(
      map((node) => node.origin.id),
      // takeWhile((id) => id !== _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM')),
      // Toggle the loading state to indicate that a request is in progress
      tap(() => this.loadingService.toggleLoading()),
      // Switch to a new observable that fetches category data details based on the node's origin ID
      // Merge the results to either initialize data for the root node
      // or a normal node based on the category code
      delay(300),
      switchMap((id) => iif(
        () => id !== _dynamic.getValue('CUC_DIA_CHAT_VIET_NAM'),
        this.initDataNormalNode.call(this, id),
        this.initDataForRootNode.call(this),
      )),
      // Toggle the loading state again to indicate that the request has completed
      tap(() => this.loadingService.toggleLoading()),
      // Handle errors by displaying a notification and logging the error to the console
      tap({
        error: (error) => {
          this.notification.create(
            TYPE_MES.error,
            'Thông báo',
            'Có lỗi xảy ra',
          );
          console.error('Request failed with error:', error);
        },
      }),
    );
  }

  initDataForRootNode() {
    return new Observable((subscriber) => {
      subscriber.next(false);
    });
  }

  initDataNormalNode(id: string) {
    return this.categoryDataService.getDetailsCategorydata(id).pipe(
      mergeMap((_res: any) => {
        const currentDataType = this.categoryDataServicePreload.getDataByType(
          _res.categoryCode,
        );
        const fields = currentDataType.data.items.filter(
          (word: any) => word.code !== 'Id',
        );

        return of(
          {
            categoryCode: _res.categoryCode,
            parentCategoryCode: currentDataType.dataSelect.parentCategoryCode,
            columns: fields,
            categoryData: _res,
          },
        );
      }),
    );
  }

  get __permission() {
    return this._permission;
  }

  get permission() {
    return this._permission.permissionObj;
  }

  get reloadTree$(): Observable<boolean> {
    return this._reloadTree.asObservable();
  }

  triggerReloadTree() {
    this._reloadTree.next(!this._reloadTree.value);
  }

  get activeTabs$(): Observable<number> {
    return this._activeTabs.asObservable();
  }

  set activeTabs(value: number) {
    this._activeTabs.next(value);
  }
}

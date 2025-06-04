import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { Breadcrumb } from './breadcrumb.model';
import { BreadcrumbService } from './breadcrumb.service';
import { RouterModule } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, NzBreadCrumbModule, RouterModule],
  template: `
    <nz-breadcrumb *ngIf="breadcrumbs.length">
      <nz-breadcrumb-item *ngFor="let breadcrumb of breadcrumbs; let last = last">
        <ng-container *ngIf="!last">
          <a [routerLink]="breadcrumb.url">{{ breadcrumb.label }}</a>
        </ng-container>
        <ng-container *ngIf="last">
          {{ breadcrumb.label }}
        </ng-container>
      </nz-breadcrumb-item>
    </nz-breadcrumb>
  `
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private rawBreadcrumbs: Breadcrumb[] = [];
  private subscriptions = new Subscription();

  constructor(
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.breadcrumbService.breadcrumbs.subscribe(bcs => {
        this.rawBreadcrumbs = bcs;
        this.updateBreadcrumbs();
      })
    );

    this.subscriptions.add(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateBreadcrumbs(); // Cập nhật lại khi đổi ngôn ngữ
      })
    );
  }

  updateBreadcrumbs(): void {
    this.breadcrumbs = this.rawBreadcrumbs.map(bc => ({
      ...bc,
      label: this.translate.instant(bc.label)
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Hủy đăng ký tránh rò rỉ bộ nhớ
  }
}

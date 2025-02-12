import { NgModule } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { PageHeaderComponent } from './page-header/page-header.component';
import { FooterTableComponent } from './footer-table/footer-table.component';

@NgModule({
  declarations: [PageHeaderComponent, FooterTableComponent],
  imports: [
    NzSpaceModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
  ],
  exports: [PageHeaderComponent, FooterTableComponent],
})
export class ComponentCommonModule {}

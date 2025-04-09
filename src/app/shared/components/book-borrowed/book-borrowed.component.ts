import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-book-borrowed',
  imports: [TranslateModule, RouterLink,NzIconModule,NzPopoverModule,NzButtonModule,NzBadgeModule],
  templateUrl: './book-borrowed.component.html',
  styleUrls: ['./book-borrowed.component.scss']
})
export class BookBorrowedComponent {
  @Input() item: any;
}

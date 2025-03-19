import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-book-borrowed',
  imports: [TranslateModule],
  templateUrl: './book-borrowed.component.html',
  styleUrls: ['./book-borrowed.component.scss']
})
export class BookBorrowedComponent {
  @Input() item: any;
}

import { Component, Input, OnChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-preview-document',
  imports: [
    NzButtonModule,
    NzModalModule,
    TranslateModule
  ],
  templateUrl: './preview-document.component.html',
  styleUrl: './preview-document.component.scss',
})
export class PreviewDocumentComponent implements OnChanges {
  @Input({ required: true }) details = ''

  compactDetails = ''

  maxLength = 20;

  isShowMore = false;

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  ngOnChanges() {
    this.compactDetails = this.details;

    const splitted = this.details.split(' ');
    this.isShowMore = splitted.length > this.maxLength;

    if (this.isShowMore) {
      this.compactDetails = `${splitted.slice(0, this.maxLength).join(' ')}...`;
    }
  }
}

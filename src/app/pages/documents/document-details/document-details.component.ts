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
  ],
  providers: [DocumentsService, HomeService],
})
export class DocumentDetailsComponent implements OnInit {
  currentDocument!: IDocument;
  constructor(
    private router: ActivatedRoute,
    private documentsService: DocumentsService,
    private changeRef: ChangeDetectorRef
  ) {}
  homeService = inject(HomeService);
  docs = this.homeService.getDocsLatest().pipe(
    switchMap((res) => {
      if (res.messageCode === 1) return of(get(res, 'data', []));

      return [];
    })
  );

  getPropertyValue = (obj: any, path: string) => {
    return get(obj, path, false);
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      const id = get(params, 'id', '');
      if (id.length > 0) {
        this.documentsService.getDocsDetails(id).subscribe((res) => {
          console.log('res', res.data[0]);
          this.currentDocument = res.data[0];
          this.changeRef.detectChanges();
        });
      }
    });
  }
}

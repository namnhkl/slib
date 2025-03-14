import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { DocumentsService } from '../documents.service';
import { IDocument } from '../documents';
import { AsyncPipe, CommonModule } from '@angular/common';
import { get } from 'lodash';
import { SharedModule } from '@/app/shared/shared.module';
import { of, switchMap } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { PreviewDocumentComponent } from "../preview-document/preview-document.component";

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
  imports: [RouterLink, SharedModule, PreviewDocumentComponent, AsyncPipe],
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
  ngOnInit() {
    this.router.params.subscribe((params) => {
      const id = get(params, 'id', '');
      if (id.length > 0) {
        this.documentsService.getDocsDetails(id).subscribe((res) => {
          this.currentDocument = res.data[0];
          this.changeRef.detectChanges()
        });
      }
    });
  }
}

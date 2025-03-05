import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { DocumentsService } from '../documents.service';
import _ from 'lodash';
import { IDocument } from '../documents';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
  imports: [RouterLink, RouterModule],
  providers: [DocumentsService],
})
export class DocumentDetailsComponent implements OnInit {
  currentDocument!: IDocument;
  constructor(
    private router: ActivatedRoute,
    private documentsService: DocumentsService
  ) {}

  ngOnInit() {
    this.router.params.subscribe((params) => {
      const id = _.get(params, 'id', '');
      if (id.length > 0) {
        this.documentsService.getDocsDetails(id).subscribe((res) => {
          this.currentDocument = res.data[0];
        });
      }
    });
  }
}

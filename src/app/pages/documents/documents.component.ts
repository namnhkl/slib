import { Component, OnInit } from '@angular/core';
import { HomeSearchAdvancedComponent } from '../home/HomeSearchAdvanced/HomeSearchAdvanced.component';
import { DocumentsService } from './documents.service';
import { RouterLink } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { get } from 'lodash';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  imports: [HomeSearchAdvancedComponent, RouterLink, FormsModule, NzSelectModule],
  providers: [DocumentsService],
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  sizeItems = [10, 20, 30, 40, 50];
  pageSizes = 10;
  pageIndex = 1;
  totalRecords = 0;
  totalPage = 0;
  constructor(
    private documentsService: DocumentsService,
  ) {
    console.log('DocumentsComponent');
  }

  ngOnInit() {
    console.log('DocumentsComponent');
    this.pageIndex = 10;
    this.documentsService.getDocsLatest().subscribe((res) => {
      console.log("🚀 ~ DocumentsComponent ~ this.documentsService.getDocsLatest ~ res:", res)
      this.documents = res.data;
      this.totalRecords = parseInt(`${get(res, 'totalRecords', 0)}`);
    });
  }

  calcPageAndPageSize(event: any) {
    return `${event * this.pageSizes}/${this.totalRecords}`;
  }

  changePageSize(event: number) {
    console.log("🚀 ~ DocumentsComponent ~ changePageSize ~ event:", event)
    this.pageSizes = event;
    this.documentsService.getDocsLatest({
      pageSize: event,
      pageIndex: this.pageIndex
    }).subscribe((res) => {
      this.documents = res.data;
    });
  }
}

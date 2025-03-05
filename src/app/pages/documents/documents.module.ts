import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { DocumentRoutingModule } from './document-routing.module';
import { DocumentsService } from './documents.service';
import { DocumentsSearchComponent } from './documents-search/documents-search.component';
import { SharedModule } from '@/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule, DocumentRoutingModule],
  declarations: [
    DocumentsComponent,
    DocumentDetailsComponent,
    DocumentsSearchComponent,
  ],
  providers: [DocumentsService],
})
export class DocumentsModule {}

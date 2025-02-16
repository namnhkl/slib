import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { DocumentRoutingModule } from './document-routing.module';
import { DocumentDetailsComponent } from './document-details/document-details.component';

@NgModule({
  imports: [CommonModule, DocumentRoutingModule],
  declarations: [DocumentsComponent, DocumentDetailsComponent],
})
export class DocumentsModule {}

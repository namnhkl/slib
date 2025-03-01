import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
// import { DocumentsSearchComponent } from './documents-search/documents-search.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsComponent,
  },
  // {
  //   path: 'author',
  //   component: DocumentsSearchComponent,
  // },
  {
    path: ':id',
    component: DocumentDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentRoutingModule {}

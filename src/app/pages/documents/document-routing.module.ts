import { Routes, RouterModule } from '@angular/router';
import { DocumentsComponent } from './documents.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { NgModule } from '@angular/core';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';

const routes: Routes = [
  { 
    path: URL_ROUTER.documents,
    children: [
      {
        path: '',
        component: DocumentsComponent,
      },
      {
        path: ':id',
        component: DocumentDetailsComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentRoutingModule {}
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { NewsComponent } from './news.component';

const route: Routes = [
  {
    path: 'news',
    component: NewsComponent,
    children: [
      {
        path: URL_ROUTER.newDetail,
        component: DetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class NewRoutingModule {}

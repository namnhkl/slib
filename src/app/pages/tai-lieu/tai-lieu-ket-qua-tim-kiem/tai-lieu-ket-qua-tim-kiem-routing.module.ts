import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchResultComponent } from "./tai-lieu-ket-qua-tim-kiem.component";

const route: Routes = [
  {
    path: '',
    component: SearchResultComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class SearchResultRoutingModule {}

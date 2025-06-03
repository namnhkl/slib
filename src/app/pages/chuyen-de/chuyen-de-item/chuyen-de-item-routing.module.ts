import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChuyenDeItemComponent } from "./chuyen-de-item.component";

const route: Routes = [
  {
    path: '',
    component: ChuyenDeItemComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class ChuyenDeItemRoutingModule {}

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { stsBoSuuTapDsChuyenDeItemComponent } from "./stsBoSuuTapDs-chuyen-de-item.component";

const route: Routes = [
  {
    path: '',
    component: stsBoSuuTapDsChuyenDeItemComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class stsBoSuuTapDsChuyenDeItemRoutingModule {}

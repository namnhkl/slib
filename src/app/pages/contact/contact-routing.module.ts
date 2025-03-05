import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactComponent } from "./contact.component";

const route: Routes = [
  {
    path: 'contact',
    component: ContactComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}

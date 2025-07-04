import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ProfileDocumentListComponent } from "./profile-document-list/profile-document-list.component";

const route: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  }
  ,
  {
    path: 'document-list',
    component: ProfileDocumentListComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}

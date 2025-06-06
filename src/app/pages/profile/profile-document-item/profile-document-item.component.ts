import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-document-item',
  standalone:true,
  templateUrl: './profile-document-item.component.html',
  styleUrls: ['./profile-document-item.component.scss'],
  imports:[CommonModule,TranslateModule]
})
export class ProfileDocumentItemComponent {
  @Input() document: any;
}

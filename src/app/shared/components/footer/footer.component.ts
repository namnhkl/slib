import { Component } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class FooterComponent {
  appInfo = environment.appInfo;
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { URL_ROUTER } from '../../shared/constants/path.constants';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NzButtonModule, NzResultModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate([URL_ROUTER.home]);
  }
}

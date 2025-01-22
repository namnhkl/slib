import { Component, HostListener, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AsideService } from './shared/components/aside/aside.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public screenWidth = signal<number>(window.innerWidth);

  constructor(private asideService: AsideService) {}

  @HostListener('window:resize')
  onResize() {
  }

  ngOnInit(): void {
  }
}

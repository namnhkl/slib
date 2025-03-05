import { CommonModule } from '@angular/common';
import {
  Component, EventEmitter, Output,
} from '@angular/core';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-trigger-collapse',
  standalone: true,
  imports: [
    CommonModule,
    NzPopoverModule,
    NzAvatarModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './trigger-collapse.component.html',
  styleUrl: './trigger-collapse.component.scss',
})
export class TriggerCollapseComponent {
  isCollapsed: boolean = false;

  @Output() dataEvent = new EventEmitter<boolean>();

  ShowHideSider(isCollap: boolean) {
    this.isCollapsed = !isCollap;
    this.dataEvent.emit(this.isCollapsed);
  }
}

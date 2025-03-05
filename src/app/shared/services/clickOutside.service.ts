import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClickOutsideService {
  private renderer: Renderer2;

  private clickOutsideSource = new Subject<MouseEvent>();

  clickOutside$ = this.clickOutsideSource.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.renderer.listen('document', 'click', (event) => {
      this.clickOutsideSource.next(event);
    });
  }
}

import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements AfterViewInit, OnDestroy {

  private cssLinkElement: HTMLLinkElement | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  private loadScript(src: string): void {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);
  }

  private loadStyle(href: string): void {
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
    this.cssLinkElement = link;  // Store the reference to the CSS link element
  }

  private removeStyle(): void {
    if (this.cssLinkElement) {
      document.head.removeChild(this.cssLinkElement);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Nạp CSS và JS động
      this.loadStyle('assets/css/main.css');

      //Set Flipbook settings
      window['FlipbookSettings'] = {
        options: {
          pageWidth: 1115,
          pageHeight: 1443,
          pages: 6
        },
        shareMessage: 'Introducing turn.js 5 - HTML5 Library for Flipbooks.',
        pageFolder: 'assets/content/magazine',
        loadRegions: true
      };

      setTimeout(() => {
        const flipbookElement = $('#flipbook');

        if (flipbookElement.length > 0) {
          flipbookElement.turn({
            width: 1115 * 2,
            height: 1443,
            autoCenter: true
          });
        } else {
          console.error('Flipbook element not found!');
        }
      }, 0);
    }
  }

  ngOnDestroy(): void {
    // Clean up CSS when the component is destroyed
    this.removeStyle();
  }
}

import { AfterViewInit, Component, Inject, Renderer2 } from '@angular/core';
import { GlobalService } from '../../core/service/global.server';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent implements AfterViewInit{
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private globalService: GlobalService
  ) {
    this.globalService.closeLoading();
  }

  ngAfterViewInit(): void {
    // Tạo thẻ <script> và gắn vào DOM
    const script = this.renderer.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js';
    script.onload = () => {
      // Gọi animation sau khi animejs đã được load
      (window as any).anime({
        targets: '.row svg',
        translateY: 10,
        autoplay: true,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate',
      });

      (window as any).anime({
        targets: '#zero',
        translateX: 10,
        autoplay: true,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate',
        scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
        rotateY: { value: '+=180', delay: 200 },
      });
    };
    this.renderer.appendChild(this.document.body, script);
  }
}

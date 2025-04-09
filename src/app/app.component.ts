import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { GlobalService } from './core/service/global.server';
import { Title } from '@angular/platform-browser';
import { TitleService } from './core/service/title.service';
import { ErrorIndicatorComponent } from "./core/components/error-indicator/error-indicator.component";
import { LoadingComponent } from "./core/components/loading/loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorIndicatorComponent, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'file-manager';
  private destroy$ = new Subject<void>();

  loadIndicator: boolean = true;
  errorIndicator: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    public globalSer: GlobalService,
    private titleService: Title,
    private customTitleService: TitleService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.globalSer.loadIndicator$.subscribe((value) => {
        this.loadIndicator = value;
      })
    );

    this.subscriptions.push(
      this.globalSer.errorIndicator$.subscribe((value) => {
        this.errorIndicator = value;
      })
    );

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getDeepestRoute(this.router.routerState.root)),
        takeUntil(this.destroy$),
        tap((route) => {
          const title = route.snapshot.data['title'];
          if (title) {
            this.titleService.setTitle(`${title} - Garago`);
            this.customTitleService.setTitle(title);
          }
        })
      )
      .subscribe();

    // Kiểm tra xem người dùng đã chọn dark mode trước đó chưa
    const savedDarkMode = localStorage.getItem('darkMode');

    // Nếu đã lưu trạng thái dark mode trước đó, khôi phục nó
    if (savedDarkMode === 'true') {
      document.querySelector('html')?.classList.add('dark');
    } else {
      // Đảm bảo rằng mặc định là light mode
      document.querySelector('html')?.classList.remove('dark');
    }
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  ngOnDestroy(): void {
    for (var subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
// import { ApplicationService } from './core/services/application.service';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  title = 'frontend';
  // private colorSchemeService = inject(ColorSchemeService);
  // private appService = inject(ApplicationService);

  // ngOnInit(): void {
  //   if (this.appService.isBrowser) {
  //     this.colorSchemeService.load();
  //   }
  // }
}

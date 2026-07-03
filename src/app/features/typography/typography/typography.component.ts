import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-typography',
    templateUrl: './typography.component.html',
    styleUrls: ['./typography.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TypographyComponent {

  constructor() { }
}

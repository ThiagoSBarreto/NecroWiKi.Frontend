import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-header',
    imports: [
        ButtonModule,
        TooltipModule
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class HeaderComponent {
}
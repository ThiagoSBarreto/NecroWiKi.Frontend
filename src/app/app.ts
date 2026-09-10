import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        SidebarComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

}
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false  // Asegurar que no sea standalone
})
export class AppComponent {
    title = 'ChatApp';
}
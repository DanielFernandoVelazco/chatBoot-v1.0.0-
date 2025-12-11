import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Agregar FormsModule

// Components
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
    { path: '', component: ChatComponent }
];

@NgModule({
    declarations: [
        ChatComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule // ✅ Agregar FormsModule aquí
    ]
})
export class ChatModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Asegurar que está importado

// Components
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
    { path: '', component: SettingsComponent }
];

@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule // ✅ Asegurar que está aquí
    ]
})
export class SettingsModule { }
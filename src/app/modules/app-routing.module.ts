import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryGuard } from '../guards/library.guard';
import { UploadComponent } from '../components/upload/upload.component';
import { ShellComponent } from '../components/shell/shell.component';
import { LibraryComponent } from '../components/library/library.component';

const routes: Routes = [
    {
        path: 'import',
        component: UploadComponent,
    },
    {
        path: 'reimport',
        component: UploadComponent,
    },
    {
        path: '',
        component: ShellComponent,
        canActivate: [LibraryGuard],
        children: [
            {
                path: '',
                redirectTo: 'albums',
                pathMatch: 'full',
            },
            {
                path: 'albums',
                component: LibraryComponent,
                data: {
                    key: 'albums',
                },
            },
            {
                path: 'artists',
                component: LibraryComponent,
                canActivate: [LibraryGuard],
                data: {
                    key: 'artists',
                },
            },
            {
                path: 'songs',
                component: LibraryComponent,
                canActivate: [LibraryGuard],
                data: {
                    key: 'songs',
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }

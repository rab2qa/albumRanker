import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListsComponent } from './components/lists/lists.component';
import { LibraryGuard } from './guards/library.guard';
import { UploadComponent } from './components/upload/upload.component';
import { ShellComponent } from './components/shell/shell.component';

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
        component: ListsComponent,
        data: {
          key: 'albums',
          name: 'Albums',
        },
      },
      {
        path: 'artists',
        component: ListsComponent,
        canActivate: [LibraryGuard],
        data: {
          key: 'artists',
          name: 'Artists',
        },
      },
      {
        path: 'songs',
        component: ListsComponent,
        canActivate: [LibraryGuard],
        data: {
          key: 'songs',
          name: 'Songs',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

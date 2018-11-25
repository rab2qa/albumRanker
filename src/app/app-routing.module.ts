import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListsComponent } from './components/lists/lists.component';

const routes: Routes = [
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
    data: {
      key: 'artists',
      name: 'Artists',
    },
  },
  {
    path: 'songs',
    component: ListsComponent,
    data: {
      key: 'songs',
      name: 'Songs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

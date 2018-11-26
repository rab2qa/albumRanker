import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StarRatingsComponent } from './components/stars/stars.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from './services/data.service';
import { ListsComponent } from './components/lists/lists.component';
import { ListComponent } from './components/lists/list/list.component';
import { ListItemComponent } from './components/lists/list/list-item/list-item.component';

@NgModule({
  declarations: [AppComponent, StarRatingsComponent, ListsComponent, ListComponent, ListItemComponent],
  imports: [BrowserModule, AppRoutingModule, NoopAnimationsModule, DragDropModule],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../components/app/app.component';
import { StarRatingsComponent } from '../components/stars/stars.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from '../services/data.service';
import { LibraryGuard } from '../guards/library.guard';
import { ShellComponent } from '../components/shell/shell.component';
import { UploadComponent } from '../components/upload/upload.component';
import { HeaderComponent } from '../components/shell/header/header.component';
import { NavigationComponent } from '../components/shell/navigation/navigation.component';
import { LibraryComponent } from '../components/library/library.component';
import { RankablesComponent } from '../components/rankables/rankables.component';
import { RankableComponent } from '../components/rankable/rankable.component';

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    NavigationComponent,
    RankableComponent,
    RankablesComponent,
    StarRatingsComponent,
    ShellComponent,
    UploadComponent,
    HeaderComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NoopAnimationsModule, DragDropModule, MatPaginatorModule],
  providers: [DataService, LibraryGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}

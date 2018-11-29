import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Injectable()
export class LibraryGuard {
  constructor(private router: Router, private dataService: DataService) {}
  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.dataService.songs) {
        resolve(true);
      } else {
        this.router.navigate(['/import']);
      }
    });
  }
}

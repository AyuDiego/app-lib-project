import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';  
import { UiSdkComponent } from '@ayudiego/ui-sdk';
import {CardComponent} from '@ayudiego/ui-sdk/card';
import { ApiService } from './service/api.service';
import { Observable, Subscribable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, UiSdkComponent, CardComponent,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
      
  characters: any; 
  
  constructor(private apiService: ApiService) {}
  title = 'app-lib-project';

  ngOnInit(): void {
    this.getData();
  
  }

  getData() {
    this.apiService.getCharacters().subscribe((data: any) => {
      this.characters = data.results;
      console.log(this.characters);
    });
  }
}

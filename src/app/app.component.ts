import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardComponent, CardDetailsComponent, UiSdkComponent } from '@ayudiego/ui-sdk'; 
import { ApiService } from './service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Character } from './models/Character';

import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

const PRIME_NG_PROVIDERS = [ConfirmationService, MessageService];
const PRIME_NG_IMPORTS = [ToastModule, ConfirmDialogModule, TabMenuModule];
const LIB_COMPONENTS = [UiSdkComponent, CardComponent, CardDetailsComponent];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    RouterLink,
    LIB_COMPONENTS,
    PRIME_NG_IMPORTS,
  ],
  providers: [PRIME_NG_PROVIDERS],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  items!: MenuItem[];
  characters: Character[] = [];
  characterSelected: any = {};
  getDataEpisode: any = {};

  activeItem!: MenuItem;
  episodesSelectedById: any = [{}];

  isStarModalSelected = false;

  get boolModalStarSelected() {
    return this.isStarModalSelected;
  }

  get dataEpisodes() {
    return  [ { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01' },
    { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02' },
    { id: 3, name: 'Anatomy Park', air_date: 'December 16, 2013', episode: 'S01E03' }
  ];
  }

  constructor(
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.characters = [];
  }
  title = 'app-lib-project';

  ngOnInit(): void {
    this.items = [
      { label: 'All' },
      { label: 'Unknown' },
      { label: 'Female' },
      { label: 'Male' },
      { label: 'Genderless' },
    ];

    this.activeItem = this.items[0];
    this.getData();
  }

  onDetail(id: number) {
    if (id) {
      this.apiService.getCharacterById(id).subscribe((character) => {
        if (character) {
          this.characterSelected = character;
        }
      }).unsubscribe;
    }

    if (
      this.episodesSelectedById.length === 0 ||
      this.episodesSelectedById === undefined
    ) {
      this.getCharacterById(id);
    } else {
      this.episodesSelectedById = [];
      this.getCharacterById(id);
    }

    this.confirmationService.confirm({
      accept: () => {
        this.messageService.add({
          severity: '',
          summary: 'Shared',
          detail: 'You have Shared',
          life: 3000,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Closed Details',
          detail: 'Details Closed',
          life: 3000,
        });
      },
    });
  }

  getData() {
    this.apiService.getCharacters().subscribe((data: any) => {
      this.characters = data.results;
      console.log(this.characters);
    });
  }

  getCharacterById(id: number) {
    this.apiService.getCharacterById(id).subscribe((character) => {
      const episodeUrls = character.episode;
      episodeUrls.forEach((url: string) => {
        const episodeId = Number(url.split('/').pop());
        this.apiService.getEpisodesById(episodeId).subscribe((episode) => {
          this.episodesSelectedById.push(episode);
        });
      });
    }).unsubscribe;
  }

  onToggleStar() {
    this.isStarModalSelected = !this.isStarModalSelected;
  }
}

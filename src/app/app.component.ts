import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  CardComponent,
  CardDetailsComponent,
  UiSdkComponent,
} from '@ayudiego/ui-sdk';
import { ApiService } from './service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Character } from './models/Character';

import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

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
    ReactiveFormsModule,
    LIB_COMPONENTS,
    PRIME_NG_IMPORTS,
  ],
  providers: [PRIME_NG_PROVIDERS],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app-lib-project';
  items!: MenuItem[];
  characters: Character[] = [];
  filteredCharacters: Character[] = [];
  characterSelected: Character | null = null;
  getDataEpisode: Record<string, unknown> = {};

  activeItem!: MenuItem;
  episodesSelectedById: Array<Record<string, unknown>> = [];

  isStarModalSelected = false;

  public readonly filterForm = new FormGroup({
    name: new FormControl(null),
  });
  private readonly filterFunctions = {
    nameFilter: (filter: Partial<Character>, value: Character) =>
      value.name.toLowerCase().includes(filter.name?.toLowerCase() || ''),
  };
  private readonly destroy$ = new Subject<void>();
  private readonly activeFilters = [this.filterFunctions.nameFilter];

  get boolModalStarSelected() {
    return this.isStarModalSelected;
  }

  get dataEpisodes() {
    return this.episodesSelectedById;
  }

  constructor(
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.filterForm
      .get('name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((name: string | null) => {
        this.filteredCharacters = this.characters.filter((character) =>
          this.activeFilters.every((filter) =>
            filter({ name: name || undefined }, character)
          )
        );
      });
  }

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
      this.apiService
        .getCharacterById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((character) => {
          if (character) {
            this.characterSelected = character;
          }
        });
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
          severity: 'success',
          summary: 'Shared',
          detail: 'Your content has been shared',
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

  filterByGender(gender: MenuItem) {
    const selectedGender = gender.label
    if (selectedGender === 'All') {
      this.filteredCharacters = this.characters;
    } else {
      this.filteredCharacters = this.characters.filter(
        (character) => character.gender === gender.label
      );
    }
   
  }

  onToggleStar() {
    this.isStarModalSelected = !this.isStarModalSelected;
  }

  private getData() {
    this.apiService
      .getCharacters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.characters = data.results;
        this.filteredCharacters = this.characters;
      });
  }

  private getCharacterById(id: number) {
    this.apiService
      .getCharacterById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((character) => {
        const episodeUrls = character.episode;
        episodeUrls.forEach((url: string) => {
          const episodeId = Number(url.split('/').pop());
          this.apiService
            .getEpisodesById(episodeId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((episode) => {
              this.episodesSelectedById.push(episode);
            });
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

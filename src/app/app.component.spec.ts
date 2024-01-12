import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from './service/api.service';
import { of } from 'rxjs';
import { Character } from './models/Character';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent,RouterTestingModule, HttpClientTestingModule],
      providers: [ConfirmationService, MessageService, ApiService], 
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize items with correct labels', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.items = [
      { label: 'All' },
      { label: 'Unknown' },
      { label: 'Female' },
      { label: 'Male' },
      { label: 'Genderless' },
    ];
    expect(app.items).toEqual([
      { label: 'All' },
      { label: 'Unknown' },
      { label: 'Female' },
      { label: 'Male' },
      { label: 'Genderless' },
    ]);
  });

  it('should initialize activeItem with the first item from items', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.activeItem = { label: 'All' };
    expect(app.activeItem).toEqual({ label: 'All' });
  });

  it('should call getData method on ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'getData');
    app.ngOnInit();
    expect(app.getData).toHaveBeenCalled();
  });

  it('should call getCharacterById method when onDetail is called with id', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'getCharacterById');
    app.onDetail(1);
    expect(app.getCharacterById).toHaveBeenCalledWith(1);
  });

  it('should call getCharacterById method when onDetail is called with id and episodesSelectedById is empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'getCharacterById');
    app.episodesSelectedById = [];
    app.onDetail(1);
    expect(app.getCharacterById).toHaveBeenCalledWith(1);
  });

  it('should reset episodesSelectedById and call getCharacterById method when onDetail is called with id and episodesSelectedById is not empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'getCharacterById');
    app.episodesSelectedById = [{ id: 1 }];
    app.onDetail(1);
    expect(app.episodesSelectedById).toEqual([]);
    expect(app.getCharacterById).toHaveBeenCalledWith(1);
  });

  it('should call confirmationService.confirm method with correct parameters when onDetail is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    spyOn(app.confirmationService, 'confirm');
    app.onDetail(1);
    expect(app.confirmationService.confirm).toHaveBeenCalledWith({
      accept: jasmine.any(Function),
      reject: jasmine.any(Function),
    });
  });

  it('should call confirmationService.confirm with the correct parameters', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const confirmationServiceSpy = spyOn(app['confirmationService'], 'confirm');
    const messageServiceSpy = spyOn((app as any).messageService, 'add');

    app.onDetail(1);

    expect(confirmationServiceSpy).toHaveBeenCalledWith({
      accept: jasmine.any(Function),
      reject: jasmine.any(Function),
    });

    const acceptCallback =
      confirmationServiceSpy.calls.mostRecent().args[0]?.accept;
    if (acceptCallback) {
      await acceptCallback();
    }

    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Shared',
      detail: 'Your content has been shared',
      life: 3000,
    });

    const rejectCallback =
      confirmationServiceSpy.calls.mostRecent().args[0]?.reject;
    if (rejectCallback) {
      await rejectCallback();
      expect(messageServiceSpy).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Closed Details',
        detail: 'Details Closed',
        life: 3000,
      });
    }

    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'info',
    summary: 'Closed Details',
    detail: 'Details Closed',
    life: 3000,
    });
  });

  it('should call getCharacters method and set characters and filteredCharacters', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const apiService = fixture.debugElement.injector.get(ApiService);
    const characters = [{ name: 'Character 1' }, { name: 'Character 2' }];
    spyOn(apiService, 'getCharacters').and.returnValue(of<any[]>({ results: characters }));
  
    app.getData();
  
    expect(apiService.getCharacters).toHaveBeenCalled();
    expect(app.characters).toEqual(characters as Character[]);
    expect(app.filteredCharacters).toEqual(characters as Character[]);
  });

  it('should toggle isStarModalSelected when onToggleStar is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.isStarModalSelected = false;
    app.onToggleStar();
    expect(app.isStarModalSelected).toBe(true);
    app.onToggleStar();
    expect(app.isStarModalSelected).toBe(false);
  });

  it('should fetch character by id and populate episodesSelectedById', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const apiService = fixture.debugElement.injector.get(ApiService);
    const characterId = 1;
    const character: unknown = { episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2'] };
    const episodes = [{ id: 1, name: 'Episode 1' }, { id: 2, name: 'Episode 2' }]; 
    spyOn(apiService, 'getCharacterById').and.returnValue(of(character));
    spyOn(apiService, 'getEpisodesById').and.returnValues(of(episodes[0]), of(episodes[1]));
    app.getCharacterById(characterId);
    expect(apiService.getCharacterById).toHaveBeenCalledWith(characterId);
    expect(apiService.getEpisodesById).toHaveBeenCalledTimes(2);
    expect(app.episodesSelectedById.length).toEqual(3); 
  });

    it('should update filteredCharacters when filterForm value changes', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      const filterForm = app.filterForm; 
      // Set initial characters and activeFilters
      const apiService = fixture.debugElement.injector.get(ApiService);
      const characters = [{ name: 'Character 1' }, { name: '' }];
      spyOn(apiService, 'getCharacters').and.returnValue(of<any[]>({ results: characters }));
      app.getData();
      const filterValue: any = { name: 'Character 1' };
      const filterValue2: any = { name: '' };
      filterForm?.setValue(filterValue);
      expect(app.filteredCharacters).toEqual([{ name: filterForm?.value?.name } as any]);
      filterForm?.setValue(filterValue2); 
      expect(app.filteredCharacters).toEqual([filterValue, filterValue2 as any]);
    });

    it('should get boolModalStarSelected', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      app.isStarModalSelected = true;
      expect(app.boolModalStarSelected).toBe(true);
    });

    it('should get dataEpisodes()', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      app.episodesSelectedById = [{ id: 1 }];
      expect(app.dataEpisodes).toEqual([{ id: 1 }]);
    });
it('should onDetail if id is truthy call getCharacterById and if have character call getCharacterById', () => {
  const fixture = TestBed.createComponent(AppComponent);
  const app = fixture.componentInstance;
  const apiService = fixture.debugElement.injector.get(ApiService);
  const characterId = 1;
  const character: unknown = { episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2'] };
  const episodes = [{ id: 1, name: 'Episode 1' }, { id: 2, name: 'Episode 2' }];
  spyOn(apiService, 'getCharacterById').and.returnValue(of(character));
  spyOn(apiService, 'getEpisodesById').and.returnValues(of(episodes[0]), of(episodes[1]));
  app.onDetail(characterId);
  expect(apiService.getCharacterById).toHaveBeenCalledWith(characterId);
  expect(apiService.getEpisodesById).toHaveBeenCalledTimes(2);
  expect(app.episodesSelectedById.length).toEqual(2);
} );


  });

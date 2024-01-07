import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve characters from the API', () => {
    const mockCharacters = [{ id: 1, name: 'Character 1' }, { id: 2, name: 'Character 2' }];

    service.getCharacters().subscribe(characters => {
      expect(characters).toEqual(mockCharacters);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character');
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters);
  });

  it('should retrieve a character by ID from the API', () => {
    const mockCharacter = { id: 1, name: 'Character 1' };
    const characterId = 1;

    service.getCharacterById(characterId).subscribe(character => {
      expect(character).toEqual(mockCharacter);
    });

    const req = httpMock.expectOne(`https://rickandmortyapi.com/api/character/${characterId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter);
  });

  it('should retrieve episodes from the API', () => {
    const mockEpisodes = [{ id: 1, name: 'Episode 1' }, { id: 2, name: 'Episode 2' }];

    service.getEpisodes().subscribe(episodes => {
      expect(episodes).toEqual(mockEpisodes);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode');
    expect(req.request.method).toBe('GET');
    req.flush(mockEpisodes);
  });

  it('should retrieve an episode by ID from the API', () => {
    const mockEpisode = { id: 1, name: 'Episode 1' };
    const episodeId = 1;

    service.getEpisodesById(episodeId).subscribe(episode => {
      expect(episode).toEqual(mockEpisode);
    });

    const req = httpMock.expectOne(`https://rickandmortyapi.com/api/episode/${episodeId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEpisode);
  });
});
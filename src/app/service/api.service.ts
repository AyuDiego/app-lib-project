import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlApi = "https://rickandmortyapi.com/api/";

  constructor(private http: HttpClient) { }

  public getCharacters(): Observable<any[]> {
    return this.http.get<any[]>(this.urlApi + 'character');
  }

  public getCharacterById(id: number): Observable<any> {
    const url = `${this.urlApi + 'character'}/${id}`;
    return this.http.get<any>(url);
  }

  public getEpisodes(): Observable<any[]> {
    return this.http.get<any[]>(this.urlApi + 'episode');
  }

  public getEpisodesById(id: number): Observable<any> {
    const url = `${this.urlApi + 'episode'}/${id}`;
    return this.http.get<any>(url);
  }
}



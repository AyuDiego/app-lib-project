import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlApi = "https://rickandmortyapi.com/api/character";

  constructor(private http: HttpClient) { }

  public getCharacters(): Observable<any[]> {
    return this.http.get<any[]>(this.urlApi);
  }

  public getCharacterById(id: number): Observable<any> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<any>(url);
  }
}

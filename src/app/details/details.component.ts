import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  standalone: true,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  character: any | undefined;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
  
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const characterId = +params['id'];
      this.loadCharacterDetails(characterId);
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  loadCharacterDetails(id: number) {
    this.apiService.getCharacterById(id).subscribe(
      (character) => {
        this.character = character;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

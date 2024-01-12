import { Episode } from "./Episode";
import { LocationCharacter } from "./LocationCharacter";

 
export interface Character {
  id: number;
    name: string;
    status: string,
    species: string,
    type: string,
    gender: string,
    origin: LocationCharacter,
    location: LocationCharacter,
    image: string,
    episode: Episode[],
    url: string,
    created: string,
};


 
class Character {
    constructor(
        public id: number,
        public name: string,
        public status: string,
        public species: string,
        public type: string,
        public gender: string,
        public origin: Location,
        public location: Location,
        public image: string,
        public episode: string[],
        public url: string,
        public created: string
    ) {}
}
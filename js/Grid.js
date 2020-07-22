class Grid{
    constructor(){
        this.nodes = new Array(64).fill().map(n => new Node());
        this.initializeNodes();
    }

    initializeNodes(){
        let n = 0;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                this.nodes[n].x = j;
                this.nodes[n].y = i;
                n++;
            }
        }
        this.nodes[0].is_Start = true;
        this.nodes[63].is_End = true;
    }
}
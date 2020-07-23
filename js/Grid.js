class Grid{
    constructor(){
        this.is_Running = false;
        this.nodes = new Array(64).fill().map(n => new Node());
        this.openSet = [];
        this.closedSet = [];
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
        this.nodes[0].value = "Start";
        this.nodes[63].is_End = true;
        this.nodes[63].value = "End";
    }

    toggleWall(i){
        if(!(this.nodes[i].is_Start || this.nodes[i].is_End)){
            this.nodes[i].is_Wall = this.nodes[i].is_Wall ? false : true;
        }
    }

    startSearch(){
        this.is_Running = true;
        
    }
}
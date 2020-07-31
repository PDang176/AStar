class Grid{
    constructor(){
        this.is_Running = false;
        this.nodes = null;
        this.startIndex = null;
        this.endIndex = null;
        this.openSet = [];
        this.initializeNodes();
    }

    initializeNodes(){
        this.nodes = new Array(64).fill().map(n => new Node());

        let n = 0;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                this.nodes[n].x = j;
                this.nodes[n].y = i;
                n++;
            }
        }

        // Start Node
        this.nodes[0].is_Start = true;
        this.nodes[0].value = "Start";
        this.startIndex = 0;

        // End Node
        this.nodes[63].is_End = true;
        this.nodes[63].value = "End";
        this.endIndex = 63

        // Start Node g, h, f costs
        this.nodes[0].g = 0;
        this.nodes[0].h = this.calculateHCost(this.nodes[0], this.nodes[63]);
        this.nodes[0].calculateFCost();
    }

    toggleWall(i){
        if(!(this.nodes[i].is_Start || this.nodes[i].is_End)){
            this.nodes[i].is_Wall = this.nodes[i].is_Wall ? false : true;
        }
    }

    calculateHCost(start, end){
        let xDist = Math.abs(start.x - end.x);
        let yDist = Math.abs(start.y - end.y);
        let remaining = Math.abs(xDist - yDist);
        return DIAGONAL_COST * Math.min(xDist, yDist) + STRAIGHT_COST * remaining;
    }

    lowestFCost(){
        let low = 0;
        for(let i = 1; i < this.openSet.length; i++){
            if(this.nodes[this.openSet[i]].f < this.nodes[this.openSet[low]].f){
                low = i;
            }
        }
        return low;
    }

    setCosts(curr, prev, cost){
        this.nodes[curr].g = this.nodes[prev].g + cost;
        this.nodes[curr].h = this.calculateHCost(this.nodes[curr], this.nodes[this.endIndex]);
        this.nodes[curr].calculateFCost();
        this.nodes[curr].prev = prev;
    }

    addNeighbors(curr, prev, cost){
        if(!(this.nodes[curr].is_Wall || this.nodes[curr].is_Closed)){
            if(!this.nodes[curr].is_Open){
                this.setCosts(curr, prev, cost);
                this.nodes[curr].is_Open = true;
                this.openSet.push(curr);
            }
            else if(this.nodes[curr].g > this.nodes[prev].g + cost){
                this.nodes[curr].g = this.nodes[prev].g + cost;
                this.nodes[curr].prev = prev;
            }
        }
    }

    calculatePath(end){
        console.log("reached end");
    }

    startSearch(){
        this.is_Running = true;
        this.nodes[this.startIndex].is_Open = true;
        this.openSet = [this.startIndex];

        while(this.openSet.length > 0){

            // Check lowest F Cost in open set
            let low = this.lowestFCost();
            let curr = this.openSet[low];

            // Move the current node to closed set
            this.openSet.splice(low, 1);
            this.nodes[curr].is_Open = false;
            this.nodes[curr].is_Closed = true;

            // If at the end node calculate the path then break
            if(curr === this.endIndex){
                this.calculatePath(this.endIndex);
                break;
            }

            // Add neighbors to open set
            if((curr + 1) % 8 !== 0){ // Right one step
                this.addNeighbors(curr + 1, curr, STRAIGHT_COST);
            }
            if(curr % 8 !== 0){ // Left one step
                this.addNeighbors(curr - 1, curr, STRAIGHT_COST);
            }
            if(curr >= 8){ // Up one step
                this.addNeighbors(curr - 8, curr, STRAIGHT_COST);
            }
            if(curr <= 55){ // Down one step
                this.addNeighbors(curr + 8, curr, STRAIGHT_COST);
            }
            if((curr + 1) % 8 !== 0 && curr >= 8){ // Right-Up one step
                this.addNeighbors(curr - 7, curr, DIAGONAL_COST);
            }
            if((curr + 1) % 8 !== 0 && curr <= 55){ // Right-Down one step
                this.addNeighbors(curr + 9, curr, DIAGONAL_COST);
            }
            if(curr % 8 !== 0 && curr >= 8){ // Left-Up one step
                this.addNeighbors(curr - 9, curr, DIAGONAL_COST);
            }
            if(curr % 8 !== 0 && curr <= 55){ // Left-Down one step
                this.addNeighbors(curr + 7, curr, DIAGONAL_COST);
            }
        }
        this.is_Running = false;
    }
}

const STRAIGHT_COST = 10;
const DIAGONAL_COST = 14;
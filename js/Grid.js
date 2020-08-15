class Grid{
    constructor(){
        this.is_Running = false;
        this.setting_Start = false;
        this.setting_End = false;
        this.nodes = null;
        this.startIndex = -1;
        this.endIndex = -1;
        this.openSet = [];
        this.initializeNodes();
    }

    resetGrid(){
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
        this.endIndex = 63;

        // Start Node g, h, f costs
        this.nodes[0].g = 0;
        this.nodes[0].h = this.calculateHCost(this.nodes[0], this.nodes[63]);
        this.nodes[0].calculateFCost();
    }

    onClick(i){
        if(this.setting_Start){
            this.setStartPos(i);
        }
        else if(this.setting_End){
            this.setEndPos(i);
        }
        else{
            this.toggleWall(i);
        }
    }

    settingStart(){
        this.setting_Start = this.setting_Start ? false : true;
    }

    setStartPos(i){
        if(this.startIndex !== -1){
            this.nodes[this.startIndex].is_Start = false;
            this.nodes[this.startIndex].value = "";
        }
        if(this.nodes[i].is_Wall){
            this.nodes[i].is_Wall = false;
        }
        if(this.nodes[i].is_End){
            this.nodes[i].is_End = false;
            this.endIndex = -1;
        }
        this.nodes[i].is_Start = true;
        this.nodes[i].value = "Start";
        this.startIndex = i;
    }

    settingEnd(){
        this.setting_End = this.setting_End ? false : true;
    }

    setEndPos(i){
        if(this.endIndex !== -1){
            this.nodes[this.endIndex].is_End = false;
            this.nodes[this.endIndex].value = "";
        }
        if(this.nodes[i].is_Wall){
            this.nodes[i].is_Wall = false;
        }
        if(this.nodes[i].is_Start){
            this.nodes[i].is_Start = false;
            this.startIndex = -1;
        }
        this.nodes[i].is_End = true;
        this.nodes[i].value = "End";
        this.endIndex = i;
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

    calculatePath(i){
        this.nodes[i].is_Path = true;
        if(i !== this.startIndex){
            this.calculatePath(this.nodes[i].prev);
        }
    }

    algorithm(){
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
            this.is_Running = false;
            return;
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

    timeoutLoop(){
        var grid = this;
        setTimeout(function(){
            grid.algorithm();
            if(grid.openSet.length > 0 && grid.is_Running){
                grid.timeoutLoop();
            }
            else{
                grid.is_Running = false;
            }
        }, 250);
    }

    startSearch(){
        this.is_Running = true;
        this.nodes[this.startIndex].is_Open = true;
        this.openSet = [this.startIndex];

        this.timeoutLoop();
    }
}

const STRAIGHT_COST = 10;
const DIAGONAL_COST = 14;
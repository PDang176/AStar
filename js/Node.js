class Node{
    constructor(){
        // Position
        this.x = null;
        this.y = null;

        // If node is start point, end point, wall, open, closed, or path
        this.is_Start = false;
        this.is_End = false;
        this.is_Wall = false;
        this.is_Open = false;
        this.is_Closed = false;
        this.is_Path = false;
        this.value = "";

        // g = path from start, h = heuristic cost to end, f = g + h
        this.g = null;
        this.h = null;
        this.f = null;

        // Previous node
        this.prev = null;
    }

    calculateFCost(){
        this.f = this.g + this.h;
    }
}
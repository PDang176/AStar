class Node{
    constructor(){
        // Position
        this.x = null;
        this.y = null;

        // If node is start point, end point, or a wall
        this.is_Start = false;
        this.is_End = false;
        this.is_Wall = false;
        this.value = "";

        // g = path from start, h = heuristic cost to end, f = g + h
        this.g = null;
        this.h = null;
        this.f = null;

        // Previous node
        this.prev = null;
    }
}
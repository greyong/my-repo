module.exports={

    items:'',

    init:function(items){
        this.items = items.split(',');
    },

    push:function(element){
        this.items.push(element);
    },
    
    pop:function(){
        return this.items.pop();
    },
    
    peek:function() {
        return this.items[this.items.length-1];
    },
    
    isEmpty:function() {
        if(this.items.length === 0) return true;
        else return false;
    },
    
    clear:function() {
        this.arr = [];
    },
        
    print:function(){
        console.log(this.items.toString());
    },

    toStr:function(){
        return this.items.toString();
    }
}
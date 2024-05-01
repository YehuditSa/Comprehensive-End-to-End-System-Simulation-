class customObject{
    constructor() {
        this.events = {}
    }

    addEventListener(name, handler) {
        if(this.events.hasOwnProperty(name))
            this.events[name].push(handler);
        else
            this.events[name] = [handler];
    }

    fireEvent(name) {
        if(!this.events.hasOwnProperty(name))
            return;

        let evs = this.events[name];
        for(let i=0;i<evs.length;i++) {
            evs[i].apply(null)
        }
    }
}

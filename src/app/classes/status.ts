///////////////////
//               //
//     STATUS    //
//               //
///////////////////

export class Status {

    public active: boolean;
    public available: boolean;
    public selected: boolean;
    public supported: boolean;
    public dirty: boolean;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor() {
        this.active = false;
        this.available = true;
        this.selected = false;
        this.supported = true;
        this.dirty = false;
    };

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public valueOf(): object {
        let response: object;

        response = {
            active: this.active,
            available: this.available,
            selected: this.selected,
            supported: this.supported,
            dirty: this.dirty
        };

        return response;
    }

    public toString(): string {
        let response: string;

        try {
            response = JSON.stringify(this.valueOf());
        } catch (exception) {
            response = "{}";
        }

        return response;
    }

}; // end class Status
///////////////////
//               //
//     STATUS    //
//               //
///////////////////

export class Status {

    public active: boolean;
    public available: boolean;
    public selected: boolean;
    public dirty: boolean;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor() {
        this.active = true;
        this.available = true;
        this.selected = false;
        this.dirty = false;
    };

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public valueOf(): object {
        var response: object;

        response = {
            active: this.active,
            available: this.available,
            selected: this.selected,
            dirty: this.dirty
        };

        return response;
    }

    public toString(): string {
        var response: string;

        try {
            response = JSON.stringify(this.valueOf());
        } catch (exception) {
            response = "{}";
        }

        return response;
    }

}; // end class Status
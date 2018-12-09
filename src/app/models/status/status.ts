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

    public toString(): string {
        let response: string;

        try {
            const valueOfThis = this.valueOf();
            response = JSON.stringify(valueOfThis);
        } catch (exception) {
            response = '{}';
        }

        return response;
    }

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

}; // End class Status
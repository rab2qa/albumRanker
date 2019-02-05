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
        let stringifiedValueOfThis: string = '{}';

        try {
            const valueOfThis: object = this.valueOf();
            stringifiedValueOfThis = JSON.stringify(valueOfThis);
        } catch (error) {
            console.error(error);
        }

        return stringifiedValueOfThis;
    }

    public valueOf(): object {
        const valueOf: object = {
            active: this.active,
            available: this.available,
            selected: this.selected,
            supported: this.supported,
            dirty: this.dirty
        };
        return valueOf;
    }

}; // End class Status
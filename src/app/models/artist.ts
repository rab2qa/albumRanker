export class Artist {

    ////////////////////////
    //                    //
    //     PROPERTIES     //
    //                    //
    ////////////////////////

    public name: string;
    public albums: Object;

    ////////////////////////////
    //                        //
    //     PUBLIC METHODS     //
    //                        //
    ////////////////////////////

    public constructor(name: string) {
        this.name = name;
        this.albums = new Object();
    }

} // End class Artist
/////////////////////////
//                     //
//     SUPPORTABLE     //
//                     //
/////////////////////////

export interface Supportable {

    isSupported(value: boolean): boolean;
    toggleSupported(): void;
    
}; // End interface Supportable
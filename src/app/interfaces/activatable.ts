/////////////////////////
//                     //
//     ACTIVATABLE     //
//                     //
/////////////////////////

export interface Activatable {

    isActive(value: boolean): boolean;
    toggleActive(): void;
    
}; // End interface Activatable
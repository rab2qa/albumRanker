////////////////////////
//                    //
//     SELECTABLE     //
//                    //
////////////////////////

export interface Selectable {

    isSelected(value: boolean): boolean;
    toggleSelected(): void;

    isAvailable(value: boolean): boolean;
    toggleAvailable(): void;

    isDirty(): boolean;
    
}; // End interface Selectable
////////////////////////
//                    //
//     SELECTABLE     //
//                    //
////////////////////////

export interface Selectable {
    
    clean(): void;

    isAvailable(value: boolean): boolean;
    isDirty(): boolean;
    isSelected(value: boolean): boolean;
    
    toggleAvailable(): void;
    toggleSelected(): void;

}; // End interface Selectable
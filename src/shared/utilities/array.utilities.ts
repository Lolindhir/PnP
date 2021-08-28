export class ArrayUtilities{

    public static sortStringArrayDescending(array: String[]): void {

        array.sort((a,b) =>  a < b ? 1 : a > b ? -1 : 0);
    
    }

    public static sortStringArrayAscending(array: String[]): void {

        array.sort((a,b) => a < b ? -1 : a > b ? 1 : 0);
    
    }
    
    public static removeFromArray(array: any[], key: any){
        const index = array.indexOf(key, 0);
        if (index > -1) {
            array.splice(index, 1);
        }
        this.sortStringArrayDescending(array);
    }

}



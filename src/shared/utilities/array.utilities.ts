export class ArrayUtilities{
    
    public static stringCompareAscending(a: string, b: string) {
        if ( a < b ){
          return -1;
        }
        if ( a > b ){
          return 1;
        }
        return 0;
    }

    public static stringCompareDescending(a: string, b: string) {
        if ( a < b ){
          return 1;
        }
        if ( a > b ){
          return -1;
        }
        return 0;
    }

    public static numberCompareAscending(a: number, b: number) {
      if ( a < b ){
        return -1;
      }
      if ( a > b ){
        return 1;
      }
      return 0;
  }

  public static numberCompareDescending(a: number, b: number) {
      if ( a < b ){
        return 1;
      }
      if ( a > b ){
        return -1;
      }
      return 0;
  }

  public static stringArrayToString(array: string[]): string{
    
    var returnString: string = '';
    for(let i = 0; i < array.length; i++){
      returnString = i === 0 ? array[0] : returnString + '$' + array[i]; 
    }
    return returnString;
  }

  public static stringToStringArray(rawString: string): string[]{
    return rawString === undefined || rawString === '' ? new Array() : rawString.split('$');
  }

  public static removeFromArray(array: any[], key: any){
      const index = array.indexOf(key, 0);
      if (index > -1) {
          array.splice(index, 1);
      }
  }

  

}



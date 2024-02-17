export class StringUtilities{

    public static appendWithComma(baseString: string, appendString: string): string {
        if (baseString !== '') {
          return baseString.trim() + ', ' + appendString.trim();
        } else {
          return appendString.trim();
        }
    }

}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightRulesSearch',
})
export class HighlightRulesSearchPipe implements PipeTransform {

  transform(value: string, search: string): string {
    if (!search) {
      return value;
    }
    const re = new RegExp(`(${search})`, 'gi');
    return value.replace(re, '<strong>$1</strong>');
  }

}

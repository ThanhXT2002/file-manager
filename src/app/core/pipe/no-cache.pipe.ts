import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noCache',
  standalone: true,
})
export class NoCachePipe implements PipeTransform {
  transform(url: string | null | undefined): string {
    if (!url) return '';
    const timestamp = new Date().getTime();
    return url.includes('?')
      ? `${url}&t=${timestamp}`
      : `${url}?t=${timestamp}`;
  }
}

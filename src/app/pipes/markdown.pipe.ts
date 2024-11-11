// src/app/pipes/markdown.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'marked';

@Pipe({
  name: 'markdownToHtml',
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return parse(value);
  }
}

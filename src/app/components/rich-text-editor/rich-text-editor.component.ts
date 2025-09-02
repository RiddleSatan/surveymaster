import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements AfterViewInit {
  @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLDivElement>;

  // --- Component State ---
  showToolbar = true;

  // --- Inputs & Outputs for two-way data binding ---
  @Input() content = '';
  @Output() contentChange = new EventEmitter<string>();

  ngAfterViewInit(): void {
    // Set initial content and enable modern CSS styling
    this.editorRef.nativeElement.innerHTML = this.content || '';
    document.execCommand('styleWithCSS', false);
    this.editorRef.nativeElement.focus();
  }

  /**
   * Executes a document command and ensures the editor is focused first.
   */
  executeCommand(command: string, value: string | null = null): void {
    this.editorRef.nativeElement.focus();
    document.execCommand(command, false, value || undefined);
  }

  /**
   * Emits the latest content when the user types.
   */
  handleInput(event: Event): void {
    const target = event.target as HTMLDivElement;
    this.contentChange.emit(target.innerHTML);
  }

  /**
   * Toggles the visibility of this editor's toolbar.
   */
  toggleToolbar(): void {
    this.showToolbar = !this.showToolbar;
  }

  // --- Toolbar Action Methods ---

  insertList(ordered = false): void {
    this.executeCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  }

  insertLink(): void {
    const url = prompt('Enter the URL:');
    if (url) this.executeCommand('createLink', url);
  }

  insertImage(): void {
    const url = prompt('Enter the image URL:');
    if (url) this.executeCommand('insertImage', url);
  }

  insertHorizontalRule(): void {
    this.executeCommand('insertHorizontalRule');
  }

  clearFormatting(): void {
    this.executeCommand('removeFormat');
    this.executeCommand('formatBlock', 'p');
  }

  // --- Event Handlers for Toolbar Controls ---

  onFormatBlockChange(event: Event): void {
    this.executeCommand('formatBlock', (event.target as HTMLSelectElement).value);
  }

  onFontNameChange(event: Event): void {
    this.executeCommand('fontName', (event.target as HTMLSelectElement).value);
  }

  onFontSizeChange(event: Event): void {
    this.executeCommand('fontSize', (event.target as HTMLSelectElement).value);
  }

  onTextColorChange(event: Event): void {
    this.executeCommand('foreColor', (event.target as HTMLInputElement).value);
  }

  onHighlightColorChange(event: Event): void {
    this.executeCommand('hiliteColor', (event.target as HTMLInputElement).value);
  }
}

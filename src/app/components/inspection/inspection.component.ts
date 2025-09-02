import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inspection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspection.components.html',
  styleUrls: ['./inspection.components.css']
})
export class InspectionComponent implements AfterViewInit {
  @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLDivElement>;

  showToolbar = true;
  content = '';

  ngAfterViewInit(): void {
    // This helps browsers like Firefox use modern CSS tags (e.g., <span>) instead of older <font> tags for styling.
    document.execCommand('styleWithCSS', false);
    this.editorRef.nativeElement.focus();
  }

  /**
   * Executes a document command to format text.
   * Note: document.execCommand is an older API, but suitable for simple editors.
   */
  executeCommand(command: string, value: string | null = null): void {
    // FIX: Focus the editor *before* executing the command.
    // This is the key fix. It ensures that even after clicking a button,
    // the editor regains focus and the command applies to the correct text selection.
    this.editorRef?.nativeElement.focus();

    document.execCommand(command, false, value || undefined);
  }

  /**
   * Updates the component's content property when the user types in the editor.
   */
  handleInput(event: Event): void {
    const target = event.target as HTMLDivElement;
    this.content = target.innerHTML;
  }

  /**
   * Inserts an ordered (numbered) or unordered (bulleted) list.
   */
  insertList(ordered = false): void {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    this.executeCommand(command);
  }

  /**
   * Prompts the user for a URL to create a hyperlink.
   * NOTE: The native prompt() dialog can be unreliable and is often blocked by browsers
   * or in certain environments. For a more robust solution, you could create a small
   * input form in your HTML that is shown/hidden instead of using prompt().
   */
  insertLink(): void {
    const url = prompt('Enter the URL:');
    if (url) {
      this.executeCommand('createLink', url);
    }
  }

  /**
   * Prompts the user for an image URL to insert an image.
   * NOTE: The native prompt() dialog can be unreliable. Consider creating a custom
   * modal or inline form in your HTML to get the image URL for a better user experience.
   */
  insertImage(): void {
    const url = prompt('Enter the image URL:');
    if (url) {
      this.executeCommand('insertImage', url);
    }
  }

  /**
   * Inserts a horizontal line.
   */
  insertHorizontalRule(): void {
    this.executeCommand('insertHorizontalRule');
  }

  /**
   * Removes all formatting from the selected text.
   */
  clearFormatting(): void {
    this.executeCommand('removeFormat');
    // Also remove block-level elements like headings
    this.executeCommand('formatBlock', 'p');
  }

  // --- Event Handlers for Toolbar Controls ---

  onFormatBlockChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.executeCommand('formatBlock', selectElement.value);
  }

  onFontNameChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.executeCommand('fontName', selectElement.value);
  }

  onFontSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.executeCommand('fontSize', selectElement.value);
  }

  onTextColorChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.executeCommand('foreColor', inputElement.value);
  }

  onHighlightColorChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.executeCommand('hiliteColor', inputElement.value);
  }

  /**
   * Toggles the visibility of the editing toolbar.
   */
  toggleToolbar(): void {
    this.showToolbar = !this.showToolbar;
  }
}


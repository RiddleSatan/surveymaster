import { Component, Input, ViewChild, forwardRef, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';

// Interface for Quill History module
interface QuillHistoryModule {
  undo(): void;
  redo(): void;
  clear(): void;
  cutoff(): void;
}

// Interface for Quill Editor with proper typing
interface QuillEditorInstance {
  history: QuillHistoryModule;
  getModule(name: string): any;
  root: HTMLElement;
  focus(): void;
  blur(): void;
}

@Component({
  selector: 'app-editor-section',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './editor-section.component.html',
  styleUrls: ['./editor-section.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorSectionComponent),
      multi: true
    }
  ]
})
export class EditorSectionComponent implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit {
  @Input() title: string = 'Editor';
  @Input() toolsVisible: boolean = true;
  @Output() toolsVisibleChange = new EventEmitter<boolean>();
  @ViewChild('editor') editor?: QuillEditorComponent;

  public quillModules: any = {};
  public toolbarId: string = '';
  
  content: string = '';
  isDisabled: boolean = false;
  private isInitialized: boolean = false;

  private onChangeCallback = (value: string) => {};
  private onTouchedCallback = () => {};

  // ControlValueAccessor implementation
  writeValue(value: any): void { 
    this.content = value || ''; 
  }
  
  registerOnChange(fn: any): void { 
    this.onChangeCallback = fn; 
  }
  
  registerOnTouched(fn: any): void { 
    this.onTouchedCallback = fn; 
  }
  
  setDisabledState(isDisabled: boolean): void { 
    this.isDisabled = isDisabled; 
  }

  ngOnInit(): void {
    this.generateToolbarId();
    this.updateQuillModules();
    this.isInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toolsVisible'] && this.isInitialized) {
      this.updateQuillModules();
      this.reinitializeEditor();
    }
    
    if (changes['title'] && this.isInitialized) {
      this.generateToolbarId();
      this.updateQuillModules();
      this.reinitializeEditor();
    }
  }

  ngAfterViewInit(): void {
    // Ensure editor is properly initialized after view init
    setTimeout(() => {
      this.initializeToolbar();
    }, 100);
  }

  private initializeToolbar(): void {
    if (this.editor?.quillEditor && this.toolsVisible) {
      try {
        // Force Quill to recognize the toolbar
        const toolbar = this.editor.quillEditor.getModule('toolbar');
        if (toolbar) {
          // Toolbar is properly connected
          console.log('Toolbar initialized successfully');
        }
      } catch (error) {
        console.warn('Toolbar initialization warning:', error);
      }
    }
  }

  private generateToolbarId(): void {
    // Sanitize title to create valid HTML ID
    this.toolbarId = `toolbar-${this.title.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()}`;
  }

  private updateQuillModules(): void {
    if (this.toolsVisible) {
      this.quillModules = {
        history: { 
          delay: 1000, 
          maxStack: 100, 
          userOnly: true 
        },
        toolbar: {
          container: `#${this.toolbarId}`
          // Remove custom handlers to let Quill handle button states
        }
      };
    } else {
      this.quillModules = {
        history: { 
          delay: 1000, 
          maxStack: 100, 
          userOnly: true 
        },
        toolbar: false
      };
    }
  }

  private reinitializeEditor(): void {
    if (this.editor && this.editor.quillEditor) {
      // Force Quill to reinitialize with new modules
      setTimeout(() => {
        try {
          const currentContent = this.content;
          this.editor!.writeValue(currentContent);
          
          // Trigger change detection
          if (this.editor!.quillEditor) {
            this.editor!.quillEditor.root.innerHTML = currentContent || '';
          }
        } catch (error) {
          console.warn('Editor reinitialize warning:', error);
        }
      }, 0);
    }
  }

  toggleTools(): void {
    this.toolsVisible = !this.toolsVisible;
    this.toolsVisibleChange.emit(this.toolsVisible);
    this.updateQuillModules();
    
    // Delay to allow DOM updates
    setTimeout(() => {
      this.initializeToolbar();
    }, 150);
  }

  onChange(value: string): void {
    this.content = value || '';
    this.onChangeCallback(this.content);
  }

  onTouched(): void {
    this.onTouchedCallback();
  }

  undo(): void { 
    if (this.editor?.quillEditor) {
      try {
        // Use the direct history API which is more reliable
        const quillEditor = this.editor.quillEditor as any;
        if (quillEditor.history && typeof quillEditor.history.undo === 'function') {
          quillEditor.history.undo();
        } else {
          // Alternative approach using getModule
          const historyModule = quillEditor.getModule('history') as QuillHistoryModule;
          if (historyModule && typeof historyModule.undo === 'function') {
            historyModule.undo();
          }
        }
      } catch (error) {
        console.warn('Undo operation failed:', error);
      }
    }
  }
  
  redo(): void { 
    if (this.editor?.quillEditor) {
      try {
        // Use the direct history API which is more reliable
        const quillEditor = this.editor.quillEditor as any;
        if (quillEditor.history && typeof quillEditor.history.redo === 'function') {
          quillEditor.history.redo();
        } else {
          // Alternative approach using getModule
          const historyModule = quillEditor.getModule('history') as QuillHistoryModule;
          if (historyModule && typeof historyModule.redo === 'function') {
            historyModule.redo();
          }
        }
      } catch (error) {
        console.warn('Redo operation failed:', error);
      }
    }
  }

  // Utility method to check if editor is ready
  isEditorReady(): boolean {
    return !!(this.editor && this.editor.quillEditor);
  }

  // Method to get current editor content
  getContent(): string {
    return this.content || '';
  }

  // Method to set content programmatically
  setContent(content: string): void {
    this.content = content || '';
    if (this.editor?.quillEditor) {
      this.editor.quillEditor.root.innerHTML = this.content;
    }
    this.onChangeCallback(this.content);
  }

  // Method to focus the editor
  focus(): void {
    if (this.editor?.quillEditor) {
      try {
        const quillEditor = this.editor.quillEditor as any;
        if (typeof quillEditor.focus === 'function') {
          quillEditor.focus();
        }
      } catch (error) {
        console.warn('Focus operation failed:', error);
      }
    }
  }

  // Method to blur the editor
  blur(): void {
    if (this.editor?.quillEditor) {
      try {
        const quillEditor = this.editor.quillEditor as any;
        if (typeof quillEditor.blur === 'function') {
          quillEditor.blur();
        }
      } catch (error) {
        console.warn('Blur operation failed:', error);
      }
    }
  }
}
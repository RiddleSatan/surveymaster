// FILE: app.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

// 1. Re-import the AssessmentFormComponent
import { AssessmentFormComponent } from './assessment-form/assessment-form.component';
import { EditorSectionComponent } from './editor-section/editor-section';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    EditorSectionComponent,
    AssessmentFormComponent // 2. Add it back to the imports array
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // All the editor logic remains the same
  showEditorTools = true;
  surveyDetailsContent = `<p>As per the instructions received by us on dated <strong>NA</strong> from...</p>`;
  notesContent = `<p>1- Vehicle <strong>Re-inspected by undersigned</strong> & photogarphs of same attached with report.</p>`;
  concludingRemarkContent = '';

  toggleEditorTools(): void {
    this.showEditorTools = !this.showEditorTools;
  }
}
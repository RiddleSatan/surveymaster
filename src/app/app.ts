// FILE: app.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

// 1. Re-import the AssessmentFormComponent
import { AssessmentFormComponent } from './components/assessment-form/assessment-form.component';
import { Inspection } from "./components/inspection/inspection.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AssessmentFormComponent // 2. Add it back to the imports array
    ,
    Inspection
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  
}
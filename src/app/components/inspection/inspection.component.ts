import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';


@Component({
  selector: 'app-inspection',
  imports: [QuillModule,CommonModule,FormsModule],
  templateUrl: './inspection.components.html',
  styleUrl: './inspection.components.css'
})
export class Inspection { 
 
inspectionContentOne:string='';
inspectionContentTwo:string='';
notesContentOne:string='';
notesContentTwo:string='';
remarkContent:string='';


}
// FILE: src/app/assessment-form/assessment-form.component.ts

import { ChangeDetectionStrategy, Component, computed, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-assessment-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './assessment-form.component.html',
  styleUrls: ['./assessment-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentFormComponent {
  // ===================================================================
  // STATE MANAGEMENT WITH SIGNALS
  // ===================================================================
  
  // --- Left Column Signals (Matching first image exactly) ---
  totalParts: WritableSignal<number> = signal(15625.00);
  paintLabour: WritableSignal<number> = signal(2587.74);
  accidentalLabour: WritableSignal<number> = signal(7080.00);
  otherEstimates: WritableSignal<number> = signal(0.00);
  towingChargesEstimate: WritableSignal<number> = signal(2500.00);

  // --- Right Column Signals ---
  isCashless: WritableSignal<boolean> = signal(true);
  towingChargesAssessed: WritableSignal<number> = signal(1500.00);
  salvageChargesValue: WritableSignal<number> = signal(8131.60);
  salvageChargesPercent: WritableSignal<number> = signal(5.00);
  averageClauseValue: WritableSignal<number> = signal(0.00);
  averageClausePercent: WritableSignal<number> = signal(5.00);
  compulsoryExcessClause: WritableSignal<number> = signal(1000.00);
  otherDeductibles: WritableSignal<number> = signal(0.00);

  // ===================================================================
  // COMPUTED CALCULATIONS
  // ===================================================================
  paintMaterial = computed(() => this.totalParts() * 0.25);
  subTotal = computed(() => this.totalParts() + this.paintMaterial() + this.paintLabour() + this.accidentalLabour());
  totalEstimate = computed(() => this.subTotal() + this.otherEstimates() + this.towingChargesEstimate());

  totalPartsAllowedA = computed(() => this.totalParts());
  totalLabourAllowedB = computed(() => this.paintLabour() + this.accidentalLabour());
  gstOnParts = computed(() => this.totalPartsAllowedA() * 0.18);
  
  grossLossAssessed = computed(() => this.totalPartsAllowedA() + this.totalLabourAllowedB() + this.towingChargesAssessed());
  totalGst = computed(() => this.gstOnParts());

  totalDeductibles = computed(() => {
    return this.salvageChargesValue() + this.averageClauseValue() + this.compulsoryExcessClause() + this.otherDeductibles();
  });

  netLossAssessed = computed(() => this.grossLossAssessed() - this.totalDeductibles());

  // Assessment table data matching the first image structure
  assessmentTableData = [
    {
      description: 'Total Parts Allowed [A]',
      grossAllowed: 'XXXXXX.YY',
      depreciation: '1280.00',
      actualAllowed: 'XXXXXX.YY',
      appliedGst: 'AAA.BB',
      assessed: 'HHHHHH.BB'
    },
    {
      description: 'Paint Material (25%)',
      grossAllowed: '750.00',
      depreciation: '944.00',
      actualAllowed: '944.00',
      appliedGst: '944.00',
      assessed: '944.00'
    },
    {
      description: 'Total Paint labour [B]',
      grossAllowed: 'XXXXXX.YY',
      depreciation: '944.00',
      actualAllowed: '944.00',
      appliedGst: '944.00',
      assessed: 'AAA.BB'
    },
    {
      description: 'Paint Labour (75%)',
      grossAllowed: '250.00',
      depreciation: '944.00',
      actualAllowed: 'AAA.BB',
      appliedGst: 'AAA.BB',
      assessed: 'AAA.BB'
    },
    {
      description: 'Gross Loss Assessed',
      grossAllowed: '17687.73',
      depreciation: '2278.00',
      actualAllowed: '3540.00',
      appliedGst: '2278.00',
      assessed: '2222278.00'
    }
  ];

  // ===================================================================
  // METHOD TO LOG DATA AS JSON
  // ===================================================================
  logDataAsJson(): void {
    const formData = {
      estimateDetails: {
        totalParts: this.totalParts(),
        paintMaterial: this.paintMaterial(),
        paintLabour: this.paintLabour(),
        accidentalLabour: this.accidentalLabour(),
        totalEstimate: this.totalEstimate(),
        towingCharges: this.towingChargesEstimate(),
      },
      assessmentSummary: {
        isCashless: this.isCashless(),
        towingCharges: this.towingChargesAssessed(),
        salvageChargesValue: this.salvageChargesValue(),
        salvageChargesPercent: this.salvageChargesPercent(),
        averageClauseValue: this.averageClauseValue(),
        averageClausePercent: this.averageClausePercent(),
        compulsoryExcessClause: this.compulsoryExcessClause(),
        otherDeductibles: this.otherDeductibles(),
      },
      calculations: {
        subTotal: this.subTotal(),
        totalEstimate: this.totalEstimate(),
        grossLossAssessed: this.grossLossAssessed(),
        netLossAssessed: this.netLossAssessed(),
      }
    };

    console.log("Current Form Data as JSON:", JSON.stringify(formData, null, 2));
  }
}
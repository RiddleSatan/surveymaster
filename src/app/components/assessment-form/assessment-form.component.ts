// FILE: src/app/assessment-form/assessment-form.component.ts

import { ChangeDetectionStrategy, Component, computed, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-assessment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './assessment-form.component.html',
 styleUrls: ['./assessment-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentFormComponent {
  // ===================================================================
  // STATE MANAGEMENT WITH SIGNALS ("STATIC DATA" / "JSON")
  // ===================================================================
  
  // --- Left Column Signals ---
  totalParts: WritableSignal<number> = signal(2304.00);
  paintLabour: WritableSignal<number> = signal(0.00);
  accidentalLabour: WritableSignal<number> = signal(0.00);
  otherEstimates: WritableSignal<number> = signal(0.00);
  towingChargesEstimate: WritableSignal<number> = signal(0.00);

  // --- Right Column Signals ---
  isCashless: WritableSignal<boolean> = signal(true);
  towingChargesAssessed: WritableSignal<number> = signal(0.00);
  salvageChargesValue: WritableSignal<number> = signal(0);
  salvageChargesPercent: WritableSignal<number> = signal(5);
  averageClauseValue: WritableSignal<number> = signal(0);
  averageClausePercent: WritableSignal<number> = signal(5);
  compulsoryExcessClause: WritableSignal<number> = signal(0);
  otherDeductibles: WritableSignal<number> = signal(0);

  // ===================================================================
  // DERIVED VALUES WITH COMPUTED SIGNALS (AUTOMATIC CALCULATIONS)
  // ===================================================================
  paintMaterial = computed(() => this.totalParts() * 0.25);
  subTotal = computed(() => this.totalParts() + this.paintMaterial() + this.paintLabour() + this.accidentalLabour());
  totalEstimate = computed(() => this.subTotal() + this.otherEstimates() + this.towingChargesEstimate());

  totalPartsAllowedA = computed(() => this.totalParts());
  totalLabourAllowedB = computed(() => this.paintLabour() + this.accidentalLabour());
  gstOnParts = computed(() => this.totalPartsAllowedA() * 0.18); // Example GST rate
  
  grossLossAssessed = computed(() => this.totalPartsAllowedA() + this.totalLabourAllowedB() + this.towingChargesAssessed());
  totalGst = computed(() => this.gstOnParts());

  totalDeductibles = computed(() => {
    return this.salvageChargesValue() + this.averageClauseValue() + this.compulsoryExcessClause() + this.otherDeductibles();
  });

  netLossAssessed = computed(() => this.grossLossAssessed() - this.totalDeductibles());

  // ===================================================================
  // METHOD TO LOG DATA AS JSON
  // ===================================================================
  logDataAsJson(): void {
    const formData = {
      estimateDetails: {
        totalParts: this.totalParts(),
        paintLabour: this.paintLabour(),
        accidentalLabour: this.accidentalLabour(),
        otherEstimates: this.otherEstimates(),
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
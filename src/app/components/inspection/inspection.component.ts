import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-inspection',
  standalone: true,
  imports: [CommonModule, RichTextEditorComponent],
  templateUrl: './inspection.components.html',
  styleUrls: ['./inspection.components.css']
})
export class InspectionComponent {
  // Property for the first editor
  surveyDetailsContent = '<h1>Survey Details</h1><p>Start here...</p>';
  // 1. ADD a new property for the second editor
  surveyDetailsContent2 = '<h2>Sub-Section</h2><p>Additional details here...</p>';

  notesContent = '<h2>Notes</h2><p>Add <b>important</b> notes here...</p>';
  concludingRemarkContent = '<h3>Conclusion</h3><p>Final remarks...</p>';

  /**
   * Gathers the content from all rich text editors, parses the HTML into a
   * structured JSON format, and logs it to the browser's console.
   */
  logDataAsJson(): void {
    const inspectionData = {
      surveyDetails: this.parseHtmlToJson(this.surveyDetailsContent),
      // 2. INCLUDE the new property in the logged JSON data
      surveyDetails2: this.parseHtmlToJson(this.surveyDetailsContent2),
      notes: this.parseHtmlToJson(this.notesContent),
      concludingRemark: this.parseHtmlToJson(this.concludingRemarkContent)
    };

    // Log the data as a nicely formatted JSON string to the console
    console.log('--- Inspection Form Data (Structured JSON) ---');
    console.log(JSON.stringify(inspectionData, null, 2));
    alert('Structured inspection data has been logged to the console (Press F12 to view).');
  }

  /**
   * Parses an HTML string into a structured array of JSON objects.
   * @param htmlString The raw HTML content from the editor.
   * @returns An array of objects representing the DOM structure.
   */
  private parseHtmlToJson(htmlString: string): any[] {
    const parser = new DOMParser();
    // Wrap content in a div to ensure a single root for parsing
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
    const results: any[] = [];
    const nodes = doc.body.firstChild?.childNodes;

    if (nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const jsonNode = this.serializeNodeToJson(nodes[i]);
        if (jsonNode) {
          results.push(jsonNode);
        }
      }
    }
    return results;
  }

  /**
   * Recursively traverses a DOM node and converts it into a JSON object.
   * @param node The DOM node to serialize.
   * @returns A JSON object representing the node, or null if the node is empty.
   */
  private serializeNodeToJson(node: Node): any {
    // 1. Handle Text Nodes
    if (node.nodeType === Node.TEXT_NODE) {
      // Only include text nodes that contain non-whitespace characters
      return node.textContent?.trim() ? node.textContent.trim() : null;
    }

    // 2. Handle Element Nodes (e.g., <p>, <h1>, <b>)
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const jsonNode: { tag: string, attributes?: any, children: any[] } = {
        tag: element.tagName.toLowerCase(),
        children: []
      };

      // Capture element attributes (like style for colors, etc.)
      if (element.attributes.length > 0) {
        jsonNode.attributes = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          jsonNode.attributes[attr.name] = attr.value;
        }
      }

      // Recursively process all child nodes
      if (element.childNodes.length > 0) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const childJson = this.serializeNodeToJson(element.childNodes[i]);
          if (childJson) { // Only add children that are not null
            jsonNode.children.push(childJson);
          }
        }
      }

      return jsonNode;
    }

    // 3. Ignore other node types (comments, etc.)
    return null;
  }
}


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { EditorSectionComponent } from './editor-section';

describe('EditorSectionComponent', () => {
  let component: EditorSectionComponent;
  let fixture: ComponentFixture<EditorSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditorSectionComponent,
        FormsModule,
        QuillModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title', () => {
    expect(component.title).toBe('Editor');
  });

  it('should have tools visible by default', () => {
    expect(component.toolsVisible).toBe(true);
  });

  it('should toggle tools visibility', () => {
    const initialState = component.toolsVisible;
    component.toggleTools();
    expect(component.toolsVisible).toBe(!initialState);
  });

  it('should update quill modules when tools are toggled', () => {
    component.toggleTools();
    expect(component.quillModules).toBeDefined();
  });

  it('should handle writeValue', () => {
    const testValue = 'Test content';
    component.writeValue(testValue);
    expect(component.content).toBe(testValue);
  });

  it('should handle writeValue with null/undefined', () => {
    component.writeValue(null);
    expect(component.content).toBe('');
    
    component.writeValue(undefined);
    expect(component.content).toBe('');
  });

  it('should register onChange callback', () => {
    const mockCallback = jasmine.createSpy('onChange');
    component.registerOnChange(mockCallback);
    expect(component.onChange).toBe(mockCallback);
  });

  it('should register onTouched callback', () => {
    const mockCallback = jasmine.createSpy('onTouched');
    component.registerOnTouched(mockCallback);
    expect(component.onTouched).toBe(mockCallback);
  });

  it('should handle onChange properly', () => {
    const testValue = 'Test change content';
    const spy = spyOn(component, 'onChange').and.callThrough();
    
    component.onChange(testValue);
    
    expect(spy).toHaveBeenCalledWith(testValue);
    expect(component.content).toBe(testValue);
  });

  it('should handle onTouched properly', () => {
    const spy = spyOn(component, 'onTouched').and.callThrough();
    
    component.onTouched();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should emit toolsVisibleChange when toggling', () => {
    spyOn(component.toolsVisibleChange, 'emit');
    const initialState = component.toolsVisible;
    
    component.toggleTools();
    
    expect(component.toolsVisibleChange.emit).toHaveBeenCalledWith(!initialState);
  });

  it('should generate proper toolbar ID', () => {
    component.title = 'Test Title';
    component.ngOnInit();
    
    expect(component.toolbarId).toBe('toolbar-test-title');
  });

  it('should handle special characters in title', () => {
    component.title = 'Test / Special & Characters';
    component.ngOnInit();
    
    expect(component.toolbarId).toBe('toolbar-test---special---characters');
  });

  it('should check if editor is ready', () => {
    expect(component.isEditorReady()).toBe(false);
  });

  it('should get and set content', () => {
    const testContent = '<p>Test content</p>';
    
    component.setContent(testContent);
    expect(component.getContent()).toBe(testContent);
  });

  it('should handle empty content gracefully', () => {
    component.setContent('');
    expect(component.getContent()).toBe('');
    
    component.setContent(null as any);
    expect(component.getContent()).toBe('');
  });

  it('should update modules when title changes', () => {
    const initialModules = component.quillModules;
    component.title = 'New Title';
    
    component.ngOnChanges({
      title: {
        currentValue: 'New Title',
        previousValue: 'Editor',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    expect(component.toolbarId).toBe('toolbar-new-title');
  });
});
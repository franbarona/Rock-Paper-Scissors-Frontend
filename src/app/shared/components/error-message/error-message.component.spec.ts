import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  describe('rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display error message when message input is provided', () => {
      const testMessage = 'This is an error message';
      
      fixture.componentRef.setInput('message', testMessage);
      fixture.detectChanges();

      const errorDiv = debugElement.query(By.css('div'));
      expect(errorDiv).toBeTruthy();
      expect(errorDiv.nativeElement.textContent).toContain(testMessage);
    });

    it('should not display div when message is null', () => {
      fixture.componentRef.setInput('message', null);
      fixture.detectChanges();

      const errorDiv = debugElement.query(By.css('div'));
      expect(errorDiv).toBeFalsy();
    });

    it('should update message when input changes', () => {
      const firstMessage = 'First error';
      const secondMessage = 'Second error';

      fixture.componentRef.setInput('message', firstMessage);
      fixture.detectChanges();
      
      let errorDiv = debugElement.query(By.css('div'));
      expect(errorDiv.nativeElement.textContent).toContain(firstMessage);

      fixture.componentRef.setInput('message', secondMessage);
      fixture.detectChanges();

      errorDiv = debugElement.query(By.css('div'));
      expect(errorDiv.nativeElement.textContent).toContain(secondMessage);
    });
  });
});
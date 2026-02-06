import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SuccessMessageComponent } from './success-message.component';

describe('SuccessMessageComponent', () => {
  let component: SuccessMessageComponent;
  let fixture: ComponentFixture<SuccessMessageComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessMessageComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  describe('rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display success message when message input is provided', () => {
      const testMessage = 'This is a success message';
      
      fixture.componentRef.setInput('message', testMessage);
      fixture.detectChanges();

      const successDiv = debugElement.query(By.css('div'));
      expect(successDiv).toBeTruthy();
      expect(successDiv.nativeElement.textContent).toContain(testMessage);
    });

    it('should not display div when message is null', () => {
      fixture.componentRef.setInput('message', null);
      fixture.detectChanges();

      const successDiv = debugElement.query(By.css('div'));
      expect(successDiv).toBeFalsy();
    });

    it('should update message when input changes', () => {
      const firstMessage = 'First success';
      const secondMessage = 'Second success';

      fixture.componentRef.setInput('message', firstMessage);
      fixture.detectChanges();
      
      let successDiv = debugElement.query(By.css('div'));
      expect(successDiv.nativeElement.textContent).toContain(firstMessage);

      fixture.componentRef.setInput('message', secondMessage);
      fixture.detectChanges();

      successDiv = debugElement.query(By.css('div'));
      expect(successDiv.nativeElement.textContent).toContain(secondMessage);
    });
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MoveSelectorComponent } from './move-selector.component';

describe('MoveSelectorComponent', () => {
  let component: MoveSelectorComponent;
  let fixture: ComponentFixture<MoveSelectorComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit ROCK when rock button is clicked', () => {
    let emittedValue: any = null;
    component.action.subscribe((move) => {
      emittedValue = move;
    });

    const buttons = debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();

    expect(emittedValue).toBe('ROCK');
  });

  it('should emit PAPER when paper button is clicked', () => {
    let emittedValue: any = null;
    component.action.subscribe((move) => {
      emittedValue = move;
    });

    const buttons = debugElement.queryAll(By.css('button'));
    buttons[1].nativeElement.click();

    expect(emittedValue).toBe('PAPER');
  });

  it('should emit SCISSORS when scissors button is clicked', () => {
    let emittedValue: any = null;
    component.action.subscribe((move) => {
      emittedValue = move;
    });

    const buttons = debugElement.queryAll(By.css('button'));
    buttons[2].nativeElement.click();

    expect(emittedValue).toBe('SCISSORS');
  });
});
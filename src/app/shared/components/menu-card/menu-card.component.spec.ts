import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MenuCardComponent } from './menu-card.component';
import { ActivatedRoute } from '@angular/router';

describe('MenuCardComponent', () => {
  let component: MenuCardComponent;
  let fixture: ComponentFixture<MenuCardComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: { params: {} },
    };
    await TestBed.configureTestingModule({
      imports: [MenuCardComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuCardComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    component.title = 'Play';
    fixture.detectChanges();

    const span = debugElement.query(By.css('span'));
    expect(span.nativeElement.textContent).toBe('Play');
  });

  it('should disable button when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const button = debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(true);
  });
});

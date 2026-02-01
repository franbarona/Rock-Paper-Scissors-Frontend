import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]), 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should have invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should enable submit button when form is valid', () => {
    const emailControl = component.form.get('email');
    const passwordControl = component.form.get('password');

    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('password123');

    expect(component.form.valid).toBe(true);
    expect(component.isFormValid()).toBe(true);
  });
});
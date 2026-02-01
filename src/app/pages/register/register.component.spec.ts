import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]), 
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form.get('username')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('emailConfirm')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should have invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should enable submit button when form is valid', () => {
    const usernameControl = component.form.get('username');
    const emailControl = component.form.get('email');
    const emailConfirmControl = component.form.get('emailConfirm');
    const passwordControl = component.form.get('password');
    usernameControl?.setValue('testuser');
    emailControl?.setValue('test@example.com');
    emailConfirmControl?.setValue('test@example.com');
    passwordControl?.setValue('password123');

    expect(component.form.valid).toBe(true);
    expect(component.isFormValid()).toBe(true);
  });
});

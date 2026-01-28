import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastGameResult } from './last-game-result';

describe('LastGameResult', () => {
  let component: LastGameResult;
  let fixture: ComponentFixture<LastGameResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastGameResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastGameResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

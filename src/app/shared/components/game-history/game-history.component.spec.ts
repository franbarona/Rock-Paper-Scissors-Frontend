import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHistoryComponent } from './game-history.component';

describe('GameHistoryComponent', () => {
  let component: GameHistoryComponent;
  let fixture: ComponentFixture<GameHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

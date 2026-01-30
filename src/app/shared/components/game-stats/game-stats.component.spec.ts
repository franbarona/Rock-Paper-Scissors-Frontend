import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatsComponent } from './game-stats.component';

describe('GameStatsComponent', () => {
  let component: GameStatsComponent;
  let fixture: ComponentFixture<GameStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameStatsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

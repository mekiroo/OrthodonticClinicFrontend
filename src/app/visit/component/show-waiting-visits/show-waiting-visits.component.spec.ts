import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWaitingVisitsComponent } from './show-waiting-visits.component';

describe('ShowWaitingVisitsComponent', () => {
  let component: ShowWaitingVisitsComponent;
  let fixture: ComponentFixture<ShowWaitingVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowWaitingVisitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowWaitingVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

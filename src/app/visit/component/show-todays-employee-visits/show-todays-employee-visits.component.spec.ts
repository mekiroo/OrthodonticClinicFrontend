import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTodaysEmployeeVisitsComponent } from './show-todays-employee-visits.component';

describe('ShowTodaysEmployeeVisitsComponent', () => {
  let component: ShowTodaysEmployeeVisitsComponent;
  let fixture: ComponentFixture<ShowTodaysEmployeeVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowTodaysEmployeeVisitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTodaysEmployeeVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

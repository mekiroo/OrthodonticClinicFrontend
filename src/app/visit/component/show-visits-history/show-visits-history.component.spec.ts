import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVisitsHistoryComponent } from './show-visits-history.component';

describe('ShowVisitsHistoryComponent', () => {
  let component: ShowVisitsHistoryComponent;
  let fixture: ComponentFixture<ShowVisitsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowVisitsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowVisitsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

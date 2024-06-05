import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockUpComponent } from './clock-up.component';

describe('ClockUpComponent', () => {
  let component: ClockUpComponent;
  let fixture: ComponentFixture<ClockUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClockUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeadersComponent } from './manage-leaders.component';

describe('ManageLeadersComponent', () => {
  let component: ManageLeadersComponent;
  let fixture: ComponentFixture<ManageLeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLeadersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageLeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

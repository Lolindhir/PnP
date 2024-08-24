import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesHomeComponent } from './rules-home.component';

describe('RulesHomeComponent', () => {
  let component: RulesHomeComponent;
  let fixture: ComponentFixture<RulesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RulesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

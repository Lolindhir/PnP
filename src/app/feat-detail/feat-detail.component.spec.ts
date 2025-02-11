import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatDetailComponent } from './feat-detail.component';

describe('SpellDetailComponent', () => {
  let component: FeatDetailComponent;
  let fixture: ComponentFixture<FeatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellDetailComponent } from './spell-detail.component';

describe('SpellDetailComponent', () => {
  let component: SpellDetailComponent;
  let fixture: ComponentFixture<SpellDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpellDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpellDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellPrintComponent } from './spell-print.component';

describe('SpellPrintComponent', () => {
  let component: SpellPrintComponent;
  let fixture: ComponentFixture<SpellPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

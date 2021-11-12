import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatListComponent } from './feat-list.component';

describe('FeatListComponent', () => {
  let component: FeatListComponent;
  let fixture: ComponentFixture<FeatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

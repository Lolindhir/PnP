import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSearchComponent } from './rules-index-search.component';

describe('IndexSearchComponent', () => {
  let component: IndexSearchComponent;
  let fixture: ComponentFixture<IndexSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndexSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

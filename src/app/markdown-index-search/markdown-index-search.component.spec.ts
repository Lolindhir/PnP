import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownIndexSearchComponent } from './markdown-index-search.component';

describe('MarkdownIndexSearchComponent', () => {
  let component: MarkdownIndexSearchComponent;
  let fixture: ComponentFixture<MarkdownIndexSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownIndexSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownIndexSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

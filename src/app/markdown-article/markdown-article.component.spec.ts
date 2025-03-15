import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownArticleComponent } from './markdown-article.component';

describe('MarkdownArticleComponent', () => {
  let component: MarkdownArticleComponent;
  let fixture: ComponentFixture<MarkdownArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

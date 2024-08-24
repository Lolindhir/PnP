import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleArticleComponent } from './rule-article.component';

describe('RuleArticleComponent', () => {
  let component: RuleArticleComponent;
  let fixture: ComponentFixture<RuleArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RuleArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

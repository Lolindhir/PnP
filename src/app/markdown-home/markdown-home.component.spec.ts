import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownHomeComponent } from './markdown-home.component';

describe('RulesHomeComponent', () => {
  let component: MarkdownHomeComponent;
  let fixture: ComponentFixture<MarkdownHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

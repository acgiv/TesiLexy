import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestoComponent } from './testo.component';

describe('TestoComponent', () => {
  let component: TestoComponent;
  let fixture: ComponentFixture<TestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

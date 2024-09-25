import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BambinoComponent } from './bambino.component';

describe('BambinoComponent', () => {
  let component: BambinoComponent;
  let fixture: ComponentFixture<BambinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BambinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BambinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

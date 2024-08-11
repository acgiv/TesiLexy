import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaarSecurityPasswordComponent } from './bar-security-password.component';

describe('BaarSecurityPasswordComponent', () => {
  let component: BaarSecurityPasswordComponent;
  let fixture: ComponentFixture<BaarSecurityPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaarSecurityPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaarSecurityPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

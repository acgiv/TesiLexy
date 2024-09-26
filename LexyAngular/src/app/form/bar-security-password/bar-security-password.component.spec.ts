import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  BarSecurityPasswordComponent } from './bar-security-password.component';

describe(' BarSecurityPasswordComponent', () => {
  let component:  BarSecurityPasswordComponent;
  let fixture: ComponentFixture< BarSecurityPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BarSecurityPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent( BarSecurityPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

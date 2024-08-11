import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperoPasswordComponent } from './recupero-password.component';

describe('RecuperoPasswordComponent', () => {
  let component: RecuperoPasswordComponent;
  let fixture: ComponentFixture<RecuperoPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperoPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperoPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

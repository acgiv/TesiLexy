import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carosello_pazientiComponent } from './carosello_pazienti.component';

describe('CaroselloComponent', () => {
  let component: Carosello_pazientiComponent;
  let fixture: ComponentFixture<Carosello_pazientiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carosello_pazientiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carosello_pazientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

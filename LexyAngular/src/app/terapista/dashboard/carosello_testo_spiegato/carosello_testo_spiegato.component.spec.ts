import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carosello_testoComponent } from './carosello_testo_spiegato.component';

describe('CaroselloComponent', () => {
  let component: Carosello_testoComponent;
  let fixture: ComponentFixture<Carosello_testoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carosello_testoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carosello_testoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscrizioneBambinoComponent } from './inscrizione-bambino.component';

describe('InscrizioneBambinoComponent', () => {
  let component: InscrizioneBambinoComponent;
  let fixture: ComponentFixture<InscrizioneBambinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscrizioneBambinoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InscrizioneBambinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

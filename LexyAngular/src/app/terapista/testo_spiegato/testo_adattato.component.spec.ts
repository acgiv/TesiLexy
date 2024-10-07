import { ComponentFixture, TestBed } from '@angular/core/testing';
import {TestoAdattatoComponent} from "./testo-adattato.component";



describe('TestoAssociatoComponent', () => {
  let component: TestoAdattatoComponent;
  let fixture: ComponentFixture<TestoAdattatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestoAdattatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestoAdattatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

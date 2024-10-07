import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotfoudComponent } from './notfoud.component';

describe('NotfoudComponent', () => {
  let component: NotfoudComponent;
  let fixture: ComponentFixture<NotfoudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotfoudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotfoudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

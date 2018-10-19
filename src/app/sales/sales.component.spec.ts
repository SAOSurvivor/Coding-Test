import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { salesComponent } from './sales.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('salesComponent', () => {
  let component: salesComponent;
  let fixture: ComponentFixture<salesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ salesComponent ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(salesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

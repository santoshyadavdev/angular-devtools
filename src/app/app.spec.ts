import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should move focus to main without leaving the route', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    document.body.appendChild(compiled);
    const link = compiled.querySelector<HTMLAnchorElement>('.skip-link')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    // `<base href="/">` would turn a bare `#main` into a navigation home.
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('main');
    compiled.remove();
  });

  it('should render the nav links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const hrefs = Array.from(compiled.querySelectorAll('nav a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/', '/products', '/examples', '/about']);
  });
});

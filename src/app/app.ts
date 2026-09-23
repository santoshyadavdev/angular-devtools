import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeToggle } from './theme-toggle';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-devtools');

  /**
   * `<base href="/">` makes a bare `#main` resolve to `/#main`, so the browser
   * would navigate home instead of moving into the current page. Move focus
   * directly and leave the route alone.
   */
  protected skipToMain(event: Event) {
    const main = document.getElementById('main');
    if (!main) return;
    event.preventDefault();
    // Focusing scrolls on its own, and the navbar is sticky: it wraps on
    // narrow viewports and grows again with the text size, so its height is
    // measured rather than assumed and the scroll is done here.
    main.focus({ preventScroll: true });
    const navbar = document.querySelector('.navbar');
    const offset = navbar ? navbar.getBoundingClientRect().height : 0;
    window.scrollTo({ top: Math.max(0, main.offsetTop - offset) });
  }
}

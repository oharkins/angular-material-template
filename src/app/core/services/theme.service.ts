import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  computed,
  effect,
  signal,
} from '@angular/core';

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map, pairwise } from 'rxjs';

export type ThemeMode = 'dark' | 'light' | null;
export type ThemeIcon = 'dark_mode' | 'light_mode' | null;
export type ThemeName = 'Switch to Dark Mode' | 'Switch to Light Mode' | '';

interface ThemeState {
  mode: ThemeMode;
  icon: ThemeIcon;
  title: ThemeName;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private state = signal<ThemeState>({
    mode: null,
    icon: null,
    title: '',
  });

  private state$ = toObservable(this.state);

  private beforeStateChange$ = this.state$
    .pipe(takeUntilDestroyed(), pairwise())
    .subscribe(([previous, current]) => {
      this.renderer.removeClass(document.body, `${previous.mode}-theme`);
    });

  public themeScheme = computed(() => this.state());

  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject('LOCALSTORAGE') private localStorage: Storage
  ) {
    // Create new renderer from renderFactory, to make it possible to use renderer2 in a service
    this.renderer = rendererFactory.createRenderer(null, null);

    effect(() => {
      let state = this.state();
      this.renderer.addClass(document.body, `${state.mode}-theme`);
    });

    this._getColorScheme();
  }

  private _setColorScheme(mode: ThemeMode) {
    this._setState(mode);
    // Save theme-scheme to localStorage
    if (mode === null) this.localStorage.removeItem('theme-mode');
    else this.localStorage.setItem('theme-mode', mode);
  }

  private _getColorScheme() {
    let mode: ThemeMode = this.localStorage.getItem('theme-mode') as ThemeMode;
    // Check if any theme-scheme is stored in localStorage
    if (mode === null) {
      // Save theme-scheme from localStorage
      mode = this._detectPrefersColorScheme();
    }
    this._setState(mode);
  }

  private _detectPrefersColorScheme() {
    let mode: ThemeMode = 'dark';
    // Detect if prefers-color-scheme is supported
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      // Set colorScheme to Dark if prefers-color-scheme is dark. Otherwise, set it to Light.
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return mode;
  }

  private _setState(mode: ThemeMode) {
    this.state.update((state) => ({
      ...state,
      mode: mode,
      icon: mode === 'dark' ? 'light_mode' : 'dark_mode',
      title: mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    }));
  }

  toggle() {
    this._setColorScheme(this.state().mode === 'dark' ? 'light' : 'dark');
  }
}

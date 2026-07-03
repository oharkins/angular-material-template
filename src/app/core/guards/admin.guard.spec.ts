import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthenticationService } from '../services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthenticationService', ['getCurrentUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthenticationService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('create an instance', () => {
    expect(guard).toBeTruthy();
  });

  it('returns true if user is admin', () => {
    authService.getCurrentUser.and.returnValue({ isAdmin: true });
    expect(guard.canActivate()).toBe(true);
  });

  it('returns false if user does not exist', () => {
    authService.getCurrentUser.and.returnValue(null);
    expect(guard.canActivate()).toBe(false);
  });

  it('returns false if user is not admin', () => {
    authService.getCurrentUser.and.returnValue({ isAdmin: false });
    expect(guard.canActivate()).toBe(false);
  });

  it('redirects to root if user is not an admin', () => {
    authService.getCurrentUser.and.returnValue({ isAdmin: false });
    guard.canActivate();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('redirects to root if user does not exist', () => {
    authService.getCurrentUser.and.returnValue(null);
    guard.canActivate();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});

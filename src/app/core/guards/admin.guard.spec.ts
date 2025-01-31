import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {

  it('create an instance', () => {
    const guard = new AdminGuard();
    expect(guard).toBeTruthy();
  });

  it('returns true if user is admin', () => {
    const guard = new AdminGuard();

    const result = guard.canActivate();

    expect(result).toBe(true);
  });

  it('returns false if user does not exist', () => {
    const guard = new AdminGuard();

    const result = guard.canActivate();

    expect(result).toBe(false);
  });

  it('returns false if user is not admin', () => {
    const user = { isAdmin: false };
    authService.getCurrentUser.and.returnValue(user);
    const guard = new AdminGuard(router, authService);

    const result = guard.canActivate();

    expect(result).toBe(false);
  });

  it('redirects to root if user is not an admin', () => {
    const user = { isAdmin: false };
    authService.getCurrentUser.and.returnValue(user);
    const guard = new AdminGuard(router, authService);

    guard.canActivate();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('redirects to root if user does not exist', () => {
    authService.getCurrentUser.and.returnValue(null);
    const guard = new AdminGuard(router, authService);

    guard.canActivate();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});

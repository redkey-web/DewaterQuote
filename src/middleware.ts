import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

export const config = {
  // Protect all /admin routes except /admin/login
  // Include both /admin exactly and /admin/* paths
  matcher: ['/admin', '/admin/((?!login).*)'],
};

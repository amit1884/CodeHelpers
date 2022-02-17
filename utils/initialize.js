import { reauthenticate } from "~/rdx/actions/authActions";

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default function saveAuthToken(ctx, token) {
  if (typeof window == 'undefined') {
    if (ctx.req.headers.cookie && token) {
      ctx.store.dispatch(reauthenticate(token));
    }
  }
  // else {
  //   const token = ctx.store.getState().authentication.token;

  //   if(token && (ctx.pathname === '/signin' || ctx.pathname === '/signup')) {
  //     setTimeout(function() {
  //       Router.push('/');
  //     }, 0);
  //   }
  // }
}

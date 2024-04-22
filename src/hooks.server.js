import { session } from 'sveltekit-server-session';

/**
 * @type {import("@sveltejs/kit").Handle}
 */
export async function handle({ event, resolve }) {
  const [sessionLocal, error] = await session.start({
    cookies: event.cookies
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  event.locals = {
    session: sessionLocal
  };
  const response = await resolve(event);

  for (const [key, value] of sessionLocal.response().headers) {
    response.headers.set(key, value);
  }

  return response;
}

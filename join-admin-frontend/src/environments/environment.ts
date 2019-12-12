// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  backendUrl: 'http://localhost:9000/api',
  rulesUrl: 'http://localhost:9000/rules',
  auth: {
    clientId: 'admin',
    redirectUri: 'auth.html',
    authUrl: 'http://localhost:9000/oauth2/access_token',
    logoutUrl: 'http://localhost:9000/signout'
  }
};

import { CONFIG } from 'src/config-global';

import { SignUpView } from 'src/sections/auth/sign-up-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>

      <SignUpView />
    </>
  );
}

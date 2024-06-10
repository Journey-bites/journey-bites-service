import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { hashPassword } from '@/utils/encryptionHelper';
import userService from '@/services/userService';

(() => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_LOGIN_CALL_BACK_URL) {
    // eslint-disable-next-line no-console
    console.log('缺少 Google 登入相關環境變數，請檢查 .env 檔案');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_LOGIN_CALL_BACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const { sub: googleId, name, picture, email } = profile._json;

        if (!email) {
          return done(null, false, { message: 'Email not found' });
        }

        const user = await userService.findUserByEmail(email);

        if (user) {
          if (user.oAuthProvider?.googleId !== googleId) {
            await userService.updateUserOauthProvider(user.id, 'googleId', googleId);
          }

          return done(null, { id: user.id, email: user.email });
        } else {
          const hashedPassword = await hashPassword(googleId);

          const newUser = await userService.createUser(email, hashedPassword, {
            displayName: name,
            avatarImageUrl: picture,
          });
          await userService.updateUserOauthProvider(newUser.id, 'googleId', googleId);

          return done(null, { id: newUser.id, email: newUser.email });
        }
      }
    )
  );
})();

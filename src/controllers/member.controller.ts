import { TribeClient } from '@tribeplatform/gql-client';
import { CLIENT_ID, CLIENT_SECRET, NETWORK_ID, MEMBER_ID, GRAPHQL_URL } from '@config';
import { logger } from '@/utils/logger';

class MemberController {
  public addAMember = async req => {
    try {
      const client = new TribeClient({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        onError: err => {
          console.log('err', err);
          return err;
        },
      });
      const accessToken = await client.generateToken({
        networkId: NETWORK_ID,
      });
      client.setToken(accessToken);
      const { email, passwordForCommunity, name } = req.body;
      const newMem = await client.auth.joinNetwork(
        {
          input: {
            email,
            password: passwordForCommunity,
            name,
          },
        },
        'basic',
      );
      //   console.log(newMem);
      return newMem;
    } catch (error) {
      console.log('error.message');
      return error.message;
    }
  };
}

export default MemberController;

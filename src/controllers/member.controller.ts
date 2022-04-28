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
          console.log(err);
        },
      });
      const accessToken = await client.generateToken({
        networkId: NETWORK_ID,
      });
      client.setToken(accessToken);
      const { email, password, name } = req.body;
      const newMem = await client.auth.joinNetwork(
        {
          input: {
            email,
            password,
            name,
          },
        },
        'basic',
      );
      //   console.log(newMem);
      return newMem;
    } catch (error) {
      logger.info(error);
      return false;
    }
  };
}

export default MemberController;

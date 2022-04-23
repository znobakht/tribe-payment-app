import { NextFunction, Request, Response } from 'express';

import { Types } from '@tribeplatform/gql-client';
import { logger } from '@/utils/logger';
import userModel from '@/models/users.model';
import transactionModel from '@/models/transaction.model';

const price = 10;

const DEFAULT_SETTINGS = {};

class WebhookController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;
    console.log(input);
    try {
      if (input.data?.challenge) {
        return res.json({
          type: 'TEST',
          status: 'SUCCEEDED',
          data: {
            challenge: req.body?.data?.challenge,
          },
        });
      }
      let result = {
        type: input.type,
        status: 'SUCCEEDED',
        data: {},
      };
      switch (input.name) {
        case 'post.created':
          {
            result = {
              type: input.type,
              status: 'FAILED',
              data: {},
            };
          }
          break;
        case 'space_join_request.created':
          {
            result = await this.checkForPayment(input);
          }
          break;
      }

      switch (input.type) {
        case 'GET_SETTINGS':
          result = await this.getSettings(input);
          break;
        case 'UPDATE_SETTINGS':
          result = await this.updateSettings(input);
          break;
        case 'SUBSCRIPTION':
          result = await this.handleSubscription(input);
          break;
      }
      res.status(200).json(result);
    } catch (error) {
      logger.error(error);
      return {
        type: input.type,
        status: 'FAILED',
        data: {},
      };
    }
  };

  /**
   *
   * @param input
   * @returns { type: input.type, status: 'SUCCEEDED', data: {} }
   * TODO: Elaborate on this function
   */
  private async checkForPayment(input) {
    try {
      const email = input.email;
      const userObject = await userModel.findOne({ email });
      if (!userObject || userObject.wallet < price) {
        return {
          type: input.type,
          status: 'FAILED',
          data: { message: 'you need to charge your account' },
        };
      }
      userObject.wallet -= price;
      await userObject.save();
      await transactionModel.create({ email, amount: price, type: 'buy' });

      return {
        type: input.type,
        status: 'SUCCEEDED',
        data: {},
      };
    } catch (error) {
      logger.error(error);
      return {
        type: input.type,
        status: 'FAILED',
        data: {},
      };
    }
  }
  /**
   *
   * @param input
   * @returns { type: input.type, status: 'SUCCEEDED', data: {} }
   * TODO: Elaborate on this function
   */
  private async getSettings(input) {
    const currentSettings = input.currentSettings[0]?.settings || {};
    let defaultSettings;
    switch (input.context) {
      case Types.PermissionContext.NETWORK:
        defaultSettings = DEFAULT_SETTINGS;
        break;
      default:
        defaultSettings = {};
    }
    const settings = {
      ...defaultSettings,
      ...currentSettings,
    };
    return {
      type: input.type,
      status: 'SUCCEEDED',
      data: settings,
    };
  }

  /**
   *
   * @param input
   * @returns { type: input.type, status: 'SUCCEEDED', data: {} }
   * TODO: Elaborate on this function
   */
  private async updateSettings(input) {
    return {
      type: input.type,
      status: 'SUCCEEDED',
      data: { toStore: input.data.settings },
    };
  }

  /**
   *
   * @param input
   * @returns { type: input.type, status: 'SUCCEEDED', data: {} }
   * TODO: Elaborate on this function
   */
  private async handleSubscription(input) {
    return {
      type: input.type,
      status: 'SUCCEEDED',
      data: {},
    };
  }
}

export default WebhookController;

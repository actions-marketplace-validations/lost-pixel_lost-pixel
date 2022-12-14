import axios from 'axios';
import { log } from './log';
import { config } from './config';

type ApiAction = 'init' | 'result' | 'finalize';

export const apiClient = axios.create({
  headers: {
    'Content-type': 'application/json',
  },
});

export const sendToAPI = async (
  action: ApiAction,
  payload: {
    projectId: string;
    branchName: string;
    repoOwner: string;
    repoName: string;
    commit: string;
  } & Record<string, unknown>,
) => {
  log(`Sending to API [${action}]`);

  try {
    const response = await apiClient.post(config.lostPixelUrl, {
      ...payload,
      action,
    });

    if (response.status !== 200) {
      log(
        `Error: Failed to send to API [${action}]. Status: ${response.status} ${response.statusText}`,
      );

      process.exit(1);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      log('API response: ', error.response?.data || error.message);
    } else if (error instanceof Error) {
      log(error.message);
    } else {
      log(error);
    }

    process.exit(1);
  }

  log(`Successfully sent to API [${action}]`);
};

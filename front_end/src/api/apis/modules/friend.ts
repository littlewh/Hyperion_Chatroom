import axios from '@/api/axios';

// 好友消息

// eslint-disable-next-line import/prefer-default-export
export async function getFriendMessage(params: PagingParams) {
  // eslint-disable-next-line no-return-await
  return await axios.get('/friend/friendMessages', {
    params,
  });
}

import axios from '@/api/axios';

// 群名搜索

export function getGroupsByName(groupName: string) {
  return axios.get(`/group/findByName?groupName=${groupName}`);
}

// 群消息
export async function getGroupMessages(params: PagingParams) {
  // eslint-disable-next-line no-return-await
  return await axios.get('/group/groupMessages', {
    params,
  });
}

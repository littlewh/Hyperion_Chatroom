interface User {
  userId: string;
  username: string;
  password: string;
  avatar: string;
  role?: string;//用户组 user or admin
  tag?: string;
  createTime: number;
  email: string
  online?: 1 | 0; // 是否在线
}

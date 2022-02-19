let bg = '';
if (process.env.VUE_APP_CDN !== 'true' && process.env.NODE_ENV === 'production') {
  bg = 'https://s3.bmp.ovh/imgs/2022/01/c3eaf2b30227e516.jpeg';
} else {
  bg = 'https://s3.bmp.ovh/imgs/2022/01/bafbd6f856110851.jpeg';
}

export const DEFAULT_GROUP = 'group';

// 默认背景图片
export const DEFAULT_BACKGROUND = bg;
// 默认机器人Id
export const DEFAULT_ROBOT = 'robot';

// 附件路径
export const IMAGE_SAVE_PATH = '/static/image/';
export const FILE_SAVE_PATH = '/static/file/';

// 文件类型
export const MIME_TYPE = [
  '3gp',
  '7z',
  'aac',
  'aep',
  'aepx',
  'aet',
  'aex',
  'ai',
  'asp',
  'aspx',
  'avi',
  'bak',
  'bat',
  'bmp',
  'c',
  'cmd',
  'cpp',
  'cs',
  'css',
  'csv',
  'db',
  'dbf',
  'div',
  'dll',
  'doc',
  'docx',
  'dot',
  'eps',
  'exe',
  'flv',
  'h',
  'htm',
  'html',
  'img',
  'java',
  'js',
  'json',
  'jsp',
  'lib',
  'LIST',
  'm4v',
  'mdb',
  'mdf',
  'mkv',
  'mov',
  'mp3',
  'mp4',
  'mpeg',
  'name',
  'operate',
  'operate',
  'pdf',
  'php',
  'ppt',
  'pptx',
  'psd',
  'py',
  'rar',
  'raw',
  'rm',
  'rmvb',
  'rtf',
  'svg',
  'tiff',
  'tmp',
  'txt',
  'vob',
  'wav',
  'wdb',
  'wma',
  'wmv',
  'wps',
  'xd',
  'xls',
  'xlsx',
  'xml',
  'zip',
];
// 图片类型
export const IMAGE_TYPE = ['png', 'jpg', 'jpeg', 'gif'];

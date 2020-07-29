//服务器地址
const http = 'http://39.101.217.150:8086/'

//接口地址
//登录
const login = 'account/login'
//菜单信息
const listForRouter = 'menu/listForRouter'
//用户信息
const info = 'account/info'
//修改密码
const updatePwd = 'account/updatePwd'
// 文章分类
const list = 'channel/list'
// 文章数量
const articlebychannel = 'article/articlebychannel'
//用户功能项信息
const menulist = 'menu/list'
//用户列表
const userlist = 'user/list'
// 部门二级联动信息、部门列表
const deptlist = 'dept/list'
//添加用户、删除用户、修改
const user = 'user'
// 获取角色
const getrole = 'role/roleTreeListByIdUser'
// 设置角色
const setrole = 'user/setRole'
// 角色列表
const rolelist = 'role/list'
// 添加角色、修改角色、删除角色
const addrole = 'role'
// 获取当前角色权限树
const setauthority = 'menu/menuTreeListByRoleId'
// 设置角色权限
const setpermisson = 'role/savePermisson'
// 添加部门、修改部门、删除部门
const dept = 'dept'
// 添加栏目、修改栏目、删除栏目
const channel = 'channel'
// 上传图片
const file = 'file'
// 添加文章、修改文章、删除文章
const addarticle = 'article'
// 获取文章列表
const articlelist = 'article/list'
// 获取文件信息
const fileMgr = 'fileMgr/list'
// 下载图片
const downloadfile = 'file/download'
// 图片预览地址
const imgdomnload = 'http://39.101.217.150/statics/'
// 添加菜单、修改、删除
const addmenu = 'menu'
// 获取字典列表
const dictlist = 'dict/list'
// 添加、修改、删除字典
const dict = 'dict'
export {
  http,
  login,
  listForRouter,
  info,
  updatePwd,
  list,
  articlebychannel,
  menulist,
  userlist,
  deptlist,
  user,
  getrole,
  setrole,
  rolelist,
  addrole,
  setauthority,
  setpermisson,
  dept,
  channel,
  file,
  addarticle,
  articlelist,
  fileMgr,
  downloadfile,
  imgdomnload,
  addmenu,
  dictlist,
  dict
}

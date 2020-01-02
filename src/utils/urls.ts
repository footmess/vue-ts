//url请求接口地址，统一管理
const urls: object = {
	login: 'login',
	logout: 'logout',
	register: 'register',
	getUsers: 'getUsers',

	addComment: 'addComment',
	addThirdComment: 'addThirdComment',
	getCommentList: 'getCommentList',

	getArticleList: 'getArticleList',
	likeArticle: 'likeArticle',
	getArticleDetail: 'getArticleDetail',

	addMessage: 'addMessage',
	getMessageList: 'getMessageList',
	getMessageDetail: 'getMessageDetail',

	getLinkList: 'getLinkList',

	getTagList: 'getTagList',

	getCategoryList: 'getCategoryList',

	getTimeAxisList: 'getTimeAxisList',
	getTimeAxisDetail: 'getTimeAxisDetail',

	getProjectList: 'getProjectList',
	getProjectDetail: 'getProjectDetail'
};

export default urls;

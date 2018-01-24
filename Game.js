var Gobang;
(function(){
	Gobang = function(Container){
		//Gobang游戏类的构造函数
		this._Animation = new IAnimation(Container);

		//成员变量声明
		this._WelcomePage = null;

		this._Init();
	}
	Gobang.fn = Gobang.prototype = {
		_Init:function(){
			var t = this;
			function CallBack(a,b){
				if(a == b){
					t._DownloadFinished();
				}
			}
			this._Animation.DownloadIMGing = CallBack;
			this._Animation.DownloadIMG(["GobangLogo","BeginGameButton"]);
		},
		_DownloadFinished:function(){
			//此处外部资源已经全部加载完毕可以创建游戏场景。
			this._CreateWelcomeScene();
			//这里留有部分用于创建游戏界面

		},
		_CreateWelcomeScene:function(){
			//创建游戏欢迎页面
			this._WelcomePage = this._Animation.CreatePage();
			//在场景中布局
			var Logo = this._WelcomePage.AddElement("GobangLogo");
			Logo.Left(this._Animation.Width/2);
			Logo.Top(this._Animation.Height/2-100);
			Logo.Visible(true);
			var BeginGameButton = this._WelcomePage.AddElement("BeginGameButton");
			BeginGameButton.Left(this._Animation.Width/2);
			BeginGameButton.Top(this._Animation.Height/2+20);
			BeginGameButton.Visible(true);
		}
	}
})();
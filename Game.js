var Gobang;
(function(){
	Gobang = function(Container){
		//Gobang游戏类的构造函数
		this._Animation = new IAnimation(Container);
		this._Listener = new ICanvasListener(Container);
		//成员变量声明
		this._WelcomePage = null;
		this._MainPage = null;
		this._BeginGameButton = null;
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
			this._Animation.DownloadIMG(["GobangLogo","BeginGameButton","Board"]);
		},
		_DownloadFinished:function(){
			//此处外部资源已经全部加载完毕可以创建游戏场景。
			this._CreateWelcomeScene();
			//这里留有部分用于创建游戏界面
			this._CreateMainScene();

			//this._Animation.SelectPage(this._MainPage);
			//事件委托
			var t = this;
			function Move(){
				t._Move();
			}
			function Down(){
				t._Down();
			}
			function Up(){
				t._Up();
			}
			this._Listener.AddEventMouseMove(Move);
			this._Listener.MouseMove(true);
			this._Listener.AddEventMouseDown(Down);
			this._Listener.MouseDown(true);
			this._Listener.AddEventMouseUp(Up);
			this._Listener.MouseUp(true);
			this._Listener.AddEventTouchMove(Move);
			this._Listener.TouchMove(true);
			this._Listener.AddEventTouchDown(Down);
			this._Listener.TouchDown(true);
			this._Listener.AddEventTouchUp(Up);
			this._Listener.TouchUp(true);
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
			this._BeginGameButton = BeginGameButton;
			BeginGameButton.Left(this._Animation.Width/2);
			BeginGameButton.Top(this._Animation.Height/2+20);
			BeginGameButton.Visible(true);
		},
		_CreateMainScene:function(){
			this._MainPage = this._Animation.CreatePage();
			var Board = this._MainPage.AddElement("Board");
			Board.Left(10);
			Board.Top(10);
			Board.Visible(true);

		},
		_Move:function(){

		},
		_Up:function(){
			var Result = this._Animation.Over(this._Listener.X,this._Listener.Y);

			if(Result == this._BeginGameButton){
				this._Animation.SelectPage(this._MainPage);
			}
		},
		_Down:function(){

		}
	}
})();
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

		this._Sight = null;
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
			this._Animation.DownloadIMG(["GobangLogo","BeginGameButton","Board","Piece"]);
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
			Board.Left(15);
			Board.Top(15);
			Board.Visible(true);

			var piece = this._MainPage.AddElement("Piece");
			var p = PiecePostionKit.BoardPostion(5,5);
			piece.Left(p.x);
			piece.Top(p.y);
			piece.Action("SetWhite()");
			piece.Visible(true);

			//创建辅助器
			var Sight = this._MainPage.AddElement("Sight");
			this._Sight = Sight;
			p = PiecePostionKit.BoardPostion(8,8);
			Sight.Left(p.x);
			Sight.Top(p.y);	
			Sight.Visible(true);
		},
		_Move:function(){
			if(this._Animation.CurrentPage == this._MainPage){
				var x = this._Listener.X;
				var y = this._Listener.Y;
				var ps = PiecePostionKit.ScreenPostion(x,y);
				if(ps.x != -1){
					var p = PiecePostionKit.BoardPostion(ps.x,ps.y);
					this._Sight.Left(p.x);
					this._Sight.Top(p.y);
				}
			}
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
	
	var PiecePostionKit = {
		//棋子落点工具
		//需要给出棋盘左上角的落点坐标（而非棋盘左上角坐标，因为有编号）
		//允许的误差半径
		//因为是工具类，设计成静态类即可
		Displacement:{	
		//棋盘偏移 我是一点点试出来因为比较快 你创建一个棋子看看什么位置能放在左上角即可
			x:52,
			y:52
		},
		Radius:20,
		BoardPostion:function(x,y){	//提供棋盘坐标 给出屏幕落点坐标
			var X,Y;
			X = this.Displacement.x + (x-1)*40;
			Y = this.Displacement.y + (y-1)*40;
			return {x:X,y:Y};
		},
		ScreenPostion:function(x,y){	//提供屏幕坐标 给出棋盘落点坐标
			var X,Y;
			X = x-this.Displacement.x+this.Radius+40;
			Y = y-this.Displacement.y+this.Radius+40;
			var X = parseInt(X/40);
			var Y = parseInt(Y/40);
			if(X>0 && X<16 && Y > 0 && Y <16)
				return {x:X,y:Y};
			return {x:-1,y:-1};
		}
	}
})();
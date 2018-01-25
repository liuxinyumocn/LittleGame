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
		this._BeginGameButtonAction = null;
		this._NewGameButton = null;

		this._GameControl = null;

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
			this._Animation.DownloadIMG(["GobangLogo","BeginGameButton","Board","Piece","WinnerPNG","PlayerPNG","NewGameButton"]);
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
			this._BeginGameButtonAction = this._Animation.CreateAction();
			this._BeginGameButtonAction.Loop(3);
			this._BeginGameButtonAction.AddAction(BeginGameButton,"Rotate()",5*Math.PI/180);
			this._BeginGameButtonAction.AddAction(100);
			this._BeginGameButtonAction.AddAction(BeginGameButton,"Rotate()",-5*Math.PI/180);
			this._BeginGameButtonAction.AddAction(100);
			this._BeginGameButtonAction.AddAction(BeginGameButton,"Rotate()",0);
		},
		_CreateMainScene:function(){
			this._MainPage = this._Animation.CreatePage();
			var Board = this._MainPage.AddElement("Board");
			Board.Left(15);
			Board.Top(15);
			Board.Visible(true);

			/*
			var piece = this._MainPage.AddElement("Piece");
			var p = PiecePostionKit.BoardPostion(5,5);
			piece.Left(p.x);
			piece.Top(p.y);
			piece.Action("SetWhite()");
			piece.Visible(true);
			*/

			//创建辅助器
			var Sight = this._MainPage.AddElement("Sight");
			this._Sight = Sight;
			p = PiecePostionKit.BoardPostion(8,8);
			Sight.Left(p.x);
			Sight.Top(p.y);	
			Sight.Visible(true);

			//新游戏按钮
			this._NewGameButton = this._MainPage.AddElement("NewGameButton");
			this._NewGameButton.Left(680);
			this._NewGameButton.Top(590);
			this._NewGameButton.Visible(true);

			//创建GameControl
			this._GameControl = new GameControl(this._MainPage);
			this._GameControl.Start();

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
			}else{
				var Result = this._Animation.Over(this._Listener.X,this._Listener.Y);
				if(Result == this._BeginGameButton)
					this._BeginGameButtonAction.Run();
			}
		},
		_Up:function(){
			var Result = this._Animation.Over(this._Listener.X,this._Listener.Y);

			if(Result == this._BeginGameButton){
				this._Animation.SelectPage(this._MainPage);
			}
			if(Result == this._NewGameButton){
				this._GameControl.Start();
			}
		},
		_Down:function(){
			if(this._Animation.CurrentPage == this._MainPage){
				//对GameControl传输指令
				var x = this._Listener.X;
				var y = this._Listener.Y;
				this._GameControl.Down(x,y);
			}
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

	var GameCore = function(){ //游戏逻辑核心
		this.Data = null;
		this.Init(); 
		this.CurrentPlayer = 1; //执黑先手
		this.Winner = 0;
		this.Steps = new Array(); //步骤记录 用于悔棋
		this.StepsNum = 0;
	}
	GameCore.fn = GameCore.prototype = {
		Init:function(){	//	两层循环初始化15*15长度的二维数组
			this.Data = new Array();
			for(var i = 0;i<15;i++){
				this.Data[i] = new Array();
				for(var n=0;n<15;n++){
					this.Data[i][n] = 0;
				}
			}
		},
		Action:function(x,y){ //落子动作 玩家由系统自动判断 提供的落点是棋盘编号
			//判断合法性
			if(this.Winner != 0)
				return false; //游戏已经结束
			if(x<1||x>15||y<1||y>15)
				return false;
			if(this.Data[x-1][y-1] != 0)
				return false; //已经有落子
			this.Data[x-1][y-1] = this.CurrentPlayer;
			this.AddSteps(x,y);
			this.CurrentPlayer = this.CurrentPlayer == 1 ? 2:1;//交换选手
			return true;
		},
		Check:function(){	//判断胜负
			//return true 胜者为 this.winner false 无胜者
			//扫描是否存在5子连要从4个方向判断 右上（或左下） 右（或左） 右下（或左上） 下（或上）
			for(var y=0;y<15;y++){
				for(var x=0;x<15;x++){
					if(this.Data[x][y] == 0)
						continue; //未落子不扫描
					var count = 1; //连子数目
					//右上扫描
					for(var i=1;i<=5;i++){
						if(x+i > 14 || y-i<0)
							break;
						if(this.Data[x+i][y-i] == this.Data[x][y]){
							count++;
						}else{
							break;
						}
					}
					if(count >= 5){
						this.Winner = this.Data[x][y];
						return true;
					}
					//右扫描
					count = 1
					for(var i=1;i<=5;i++){
						if(x+i > 14)
							break;
						if(this.Data[x+i][y] == this.Data[x][y]){
							count++;
						}else{
							break;
						}
					}
					if(count >= 5){
						this.Winner = this.Data[x][y];
						return true;
					}
					//右下扫描
					count = 1
					for(var i=1;i<=5;i++){
						if(x+i > 14 || y+i > 14)
							break;
						if(this.Data[x+i][y+i] == this.Data[x][y]){
							count++;
						}else{
							break;
						}
					}
					if(count >= 5){
						this.Winner = this.Data[x][y];
						return true;
					}
					//下扫描
					count = 1
					for(var i=1;i<=5;i++){
						if(y+i > 14)
							break;
						if(this.Data[x][y+i] == this.Data[x][y]){
							count++;
						}else{
							break;
						}
					}
					if(count >= 5){
						this.Winner = this.Data[x][y];
						return true;
					}

				}
			}
			return false;
		},
		AddSteps:function(x,y){
			var p = this.CurrentPlayer;
			this.Steps[this.StepsNum++] = {x:x,y:y,p:p};
		}
	}

	var GameControl = function(MainPage){
		this.MainPage = MainPage;
		this.GameCore = null;

		this.Pieces = new Array();
		this.PiecesNum = 0;

		this.WinnerPNG = this.MainPage.AddElement("WinnerPNG");
		this.WinnerPNG.Left(330);
		this.WinnerPNG.Top(170);

		this.PlayerPNG = this.MainPage.AddElement("PlayerPNG");
		this.PlayerPNG.Left(685);
		this.PlayerPNG.Top(80);
		this.PlayerPNG.Visible(true);


	}
	GameControl.fn = GameControl.prototype = {
		Start:function(){	//开始游戏 或者 重新一局
			this.GameCore = new GameCore(); //创建游戏核心
			this.Show();	//映射核心 该函数会被反复使用 有可能用于重连载入
			this.WinnerPNG.Visible(false);
		},
		Show:function(){
			//该函数用于将场景完全恢复后映射GameCore中所存数据
			//棋盘数据
			this.HidePiece();
			for(var x=0;x<15;x++){
				for(var y=0;y<15;y++){
					if(this.GameCore.Data[x][y] != 0){
						this.SetPositon(this.GetPiece(this.GameCore.Data[x][y]),x+1,y+1);
					}
				}
			}
			this.PlayerPNG.Action("SetColor()",this.GameCore.CurrentPlayer);
		},
		HidePiece:function(){
			for(var i = 0;i<this.PiecesNum;i++){
				this.Pieces[i].Visible(false);
			}
		},
		SetPositon:function(piece,x,y){	//设置位置并显示
			var p = PiecePostionKit.BoardPostion(x,y);
			piece.Left(p.x);
			piece.Top(p.y);
			piece.Visible(true);
		},
		GetPiece:function(Color){	//获取一个空闲棋子 并设置颜色
			for(var i=0;i<this.PiecesNum;i++){
				if(this.Pieces[i].Visible() == false){
					if(Color == 1){
						this.Pieces[i].Action("SetBlack()");
					}else{
						this.Pieces[i].Action("SetWhite()");
					}
					return this.Pieces[i];
				}
			}
			var p = this.MainPage.AddElement("Piece");
			this.Pieces[this.PiecesNum++] = p;
			if(Color == 2)
				p.Action("SetWhite()");
			return p;
		},
		Down:function(x,y){
			var ps = PiecePostionKit.ScreenPostion(x,y);
			if(ps.x != -1){//说明有落点
				this.GameCore.Action(ps.x,ps.y);
				this.Show();
				var re = this.GameCore.Check();
				if(re){
					this.WinnerPNG.Action("SetColor()",this.GameCore.Winner);
					this.MainPage.SetPosition(this.WinnerPNG,-1);
					this.WinnerPNG.Visible(true);
				}
			}
		}
	}

})();


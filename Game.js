var Gobang;
(function(){
	function DeJSONCode(json){ // 解析JSON数据 false 解析失败， Ob解析成功
		var Ob;
		try{
			Ob =  eval('(' + json + ')');
		}catch(e){
			return false;
		}
		return Ob;
	}
	Gobang = function(Container){
		//Gobang游戏类的构造函数
		this._Animation = new IAnimation(Container);
		this._Listener = new ICanvasListener(Container);

		this._Rate = 1;
		//成员变量声明
		this._WelcomePage = null;
		this._MainPage = null;
		this._SelectRoomPage = null;
		this._BeginGameButton = null;
		this._BeginGameButtonAction = null;
		this._NewGameButton = null;
		this._BackButton = null;
		this._BattleOnlineButton = null;
		this._BattleOnlineButtonAction = null;

		this._ReadyButton = null;
		this._FriReadyButton = null;
		this._StartStatus = false;

		this._NumbersButton = null;
		this._OnelineLink=null;
		this._OneLine=null;

		this._GameControl = null;

		this._Sight = null;

		this._Server = null;
		//事件
		this.OnClickBattleOnlineButton = function(){}	//需要提供4位数字字符串提供面对面对战口令
		this.OnResponse = function(e,ds){}

		this._Init();
	}
	Gobang.fn = Gobang.prototype = {
		Rate:function(v){
			if(v==null)
				return this._Rate;
			else if(v>0){
				this._Rate = v;
				this._Animation.Rate(v);
			}
		},
		_Init:function(){
			var t = this;
			var LoadingPage = this._Animation.CreatePage();
			var Info = LoadingPage.AddElement("Loading");
			Info.Left(this._Animation.Width/2);
			Info.Top(this._Animation.Height/2);
			Info.Visible(true);
			function CallBack(a,b){
				Info.Action("Finish()",b/a);
				if(a == b){
					t._DownloadFinished();
				}
			}
			this._Animation.DownloadIMGing = CallBack;
			this._Animation.DownloadIMG(["GobangLogo","BeginGameButton","Board","Piece","WinnerPNG","PlayerPNG","NewGameButton","BackButton","BattleOnlineButton","SelectRoomTIP","Number","OneLine","WaitingFriend","ReadyPNG","ReEnterRoomPNG"]);
			
			this._Server = new Server();
			//this._Server.SetInfo("ws://121.42.197.141","8888");
			var t = this;
			this._Server.OnErr = function(d,ds){
				t.OnResponse(d,ds);
			}
			this._Server.OnMessage = function(data){
				t._GetServerMessage(data);
			}
		},
		_DownloadFinished:function(){
			//此处外部资源已经全部加载完毕可以创建游戏场景。
			this._CreateWelcomeScene();
			//这里留有部分用于创建游戏界面
			this._CreateMainScene();
			//创建房间选择游戏界面
			this._CreateSelectRoom();

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
			this._Animation.SelectPage(this._WelcomePage);
		},
		_CreateWelcomeScene:function(){
			//创建游戏欢迎页面
			this._WelcomePage = this._Animation.CreatePage();
			//在场景中布局
			var Logo = this._WelcomePage.AddElement("GobangLogo");
			Logo.Left(this._Animation.Width/2);
			Logo.Top(this._Animation.Height/2-150);
			Logo.Visible(true);
			var BeginGameButton = this._WelcomePage.AddElement("BeginGameButton");
			this._BeginGameButton = BeginGameButton;
			BeginGameButton.Left(this._Animation.Width/2);
			BeginGameButton.Top(this._Animation.Height/2-30);
			BeginGameButton.Visible(true);
			this._BeginGameButtonAction = this._Animation.CreateAction();
			this._BeginGameButtonAction.Loop(3);
			this._BeginGameButtonAction.AddAction(BeginGameButton,"Rotate()",5*Math.PI/180);
			this._BeginGameButtonAction.AddAction(100);
			this._BeginGameButtonAction.AddAction(BeginGameButton,"Rotate()",-5*Math.PI/180);
			this._BeginGameButtonAction.AddAction(100);
			this._BeginGameButtonAction.AddAction(BeginGameButton,"Rotate()",0);
		
			this._BattleOnlineButton = this._WelcomePage.AddElement("BattleOnlineButton");
			this._BattleOnlineButton.Left(this._Animation.Width/2);
			this._BattleOnlineButton.Top(this._Animation.Height/2+60);
			this._BattleOnlineButton.Visible(true);
			this._BattleOnlineButtonAction = this._Animation.CreateAction();
			this._BattleOnlineButtonAction .Loop(3);
			this._BattleOnlineButtonAction .AddAction(this._BattleOnlineButton ,"Rotate()",5*Math.PI/180);
			this._BattleOnlineButtonAction .AddAction(100);
			this._BattleOnlineButtonAction .AddAction(this._BattleOnlineButton ,"Rotate()",-5*Math.PI/180);
			this._BattleOnlineButtonAction .AddAction(100);
			this._BattleOnlineButtonAction .AddAction(this._BattleOnlineButton ,"Rotate()",0);

		},
		_CreateMainScene:function(){
			this._MainPage = this._Animation.CreatePage();
			var Board = this._MainPage.AddElement("Board");
			Board.Left(15);
			Board.Top(15);
			Board.Visible(true);

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
			//this._NewGameButton.Visible(true);

			//准备按钮
			this._ReadyButton = this._MainPage.AddElement("ReadyPNG");
			this._ReadyButton.Left(680);
			this._ReadyButton.Top(590);
			this._ReadyButton.Visible(true);

			//对方准备状态按钮
			this._FriReadyButton = this._MainPage.AddElement("ReadyPNG");
			this._FriReadyButton.Left(680);
			this._FriReadyButton.Top(150);
			this._FriReadyButton.Action("SetStatus()",2);
			this._FriReadyButton.Visible(true);

			//悔棋按钮
			this._BackButton = this._MainPage.AddElement("BackButton");
			this._BackButton.Left(680);
			this._BackButton.Top(500);
			this._BackButton.Visible(true);

			//创建GameControl
			this._GameControl = new GameControl(this._MainPage);
			this._GameControl.Start();

		},
		_CreateSelectRoom:function(){
			//选择游戏房间界面
			this._SelectRoomPage = this._Animation.CreatePage();
			var TIP = this._SelectRoomPage.AddElement("SelectRoomTIP");
			TIP.Left(this._Animation.Width/2);
			TIP.Top(60);
			TIP.Visible(true);

			this._ReEnterRoomTIP = this._SelectRoomPage.AddElement("ReEnterRoomPNG");
			this._ReEnterRoomTIP.Left(this._Animation.Width/2);
			this._ReEnterRoomTIP.Top(560);

			this._WaitingFriendPNG = this._SelectRoomPage.AddElement("WaitingFriend");
			this._WaitingFriendPNG.Left(150);
			this._WaitingFriendPNG.Top(600);

			this._NumbersButton = new Array();
			this._OneLine = this._SelectRoomPage.AddElement("OneLine");
			this._OneLine.Visible(true);
			var pos = [225,175,375,175,525,175,225,325,375,325,525,325,225,475,375,475,525,475];
			for(var i = 0;i<9;i++){
				this._NumbersButton[i] = this._SelectRoomPage.AddElement("Number");
				this._NumbersButton[i].Left(pos[i*2]);
				this._NumbersButton[i].Top(pos[i*2+1]);
				this._NumbersButton[i].Action("SetNumber()",i+1);
				this._NumbersButton[i].Visible(true);
			}
			

		},
		_Move:function(){
			if(this._Animation.CurrentPage == this._MainPage){
				this.ReflashSight()
			}else{
				var Result = this._Animation.Over(this._Listener.X/this._Rate,this._Listener.Y/this._Rate);
				if(Result == this._BeginGameButton)
					this._BeginGameButtonAction.Run();
				if(Result == this._BattleOnlineButton)
					this._BattleOnlineButtonAction.Run();
			}

			if(this._Animation.CurrentPage == this._SelectRoomPage){
				var Result = this._Animation.Over(this._Listener.X/this._Rate,this._Listener.Y/this._Rate);
				if(this._OnelineLink != null){
					this._OnelineLink.Click(Result);
				}
			}
		},
		_Up:function(){
			var Result = this._Animation.Over(this._Listener.X/this._Rate,this._Listener.Y/this._Rate);
			if(this._Animation.CurrentPage == this._MainPage){
				//对GameControl传输指令
				var x = this._Listener.X/this._Rate;
				var y = this._Listener.Y/this._Rate;
				if(!this._StartStatus)
					this._GameControl.Down(x,y);
				else{
					//向网络发送
					if(this._GameControl.CanDown(x,y)){
						var ps = PiecePostionKit.ScreenPostion(x,y);
						this._Server.Sent("{\"ac\":\"Down\",\"x\":\""+ps.x+"\",\"y\":\""+ps.y+"\"}");
					}
				}
			}
			if(Result == this._BeginGameButton){
				this._LoaclGameInit();
			}else if(Result == this._NewGameButton){
				this._GameControl.Start();
			}else if(Result == this._BackButton){
				this._GameControl.Back();
			}else if(Result == this._BattleOnlineButton){
				//this.Connect();
				this._Animation.SelectPage(this._SelectRoomPage);
			}else if(Result == this._ReadyButton){
				//向服务器发送状态
				var status = 1;
				if(this._ReadyButton.Action("GetStatus()") == 1){
					status = 0;
					//console.log(status);
				}
				this._Server.Sent("{\"ac\":\"Ready\",\"mine\":\""+status+"\"}");
			}

			if(this._OnelineLink != null){
				//结算
				//console.log(this._OnelineLink.GetText());
				var key = this._OnelineLink.GetText();
				if(key.length <= 2){
					this._OnelineLink.Init();
					this._OnelineLink = null;
				}else{
					//开始连接服务器并发送Key值
					this._ApplyRoom(key);
				}
				this._OnelineLink = null;
			}
		},
		_Down:function(){
			if(this._Animation.CurrentPage == this._MainPage){
				this.ReflashSight();
			}else if(this._Animation.CurrentPage == this._SelectRoomPage){
				var t = this;
				function IsNumber(Result){
					for(var i = 0;i<9;i++){
						if(t._NumbersButton[i] == Result){
							t._ReEnterRoomTIP.Visible(false);
							t._OnelineLink = new OneLineLink(t._NumbersButton,t._OneLine);
							t._OnelineLink.Click(Result);
							break;
						}
					}
				}
				var Result = this._Animation.Over(this._Listener.X/this._Rate,this._Listener.Y/this._Rate);
				if(IsNumber(Result)){

				}
			}
		},
		ReflashSight:function(){
			var x = this._Listener.X/this._Rate;
			var y = this._Listener.Y/this._Rate;
			var ps = PiecePostionKit.ScreenPostion(x,y);
			if(ps.x != -1){
				var p = PiecePostionKit.BoardPostion(ps.x,ps.y);
				this._Sight.Left(p.x);
				this._Sight.Top(p.y);
			}
		},
		BattleOnlineKey:function(key){
			//key必须是小于4位的整数
			var int = parseInt(key);
			if(int = key && key >=0 && key <= 9999){
				
			}else{
				return false;
			}
		},
		Connect:function(){
			var t = this;
			if(!this._Server.Open)
				this._Server.Connect();
		},
		_GetServerMessage:function(data){
			var json = DeJSONCode(data.data);
			if(json == false)
			{
				//未能识别的数据
			}else{
				//来自服务器端的消息
				/*
					//进入房间
					{	
						ac:"EnterRoom"
					}
					//离开游戏房间
					{
						ac:"ExitRoom"
					}
					//进入准备/取消准备
					{
						ac:"Ready",
						piece:1/2,   准备棋颜色 1 黑色 2 白色
						status:0/1   0取消准备 1准备
					}
					//开局
					{
						ac:"Start",
						piece:1/2	我方棋子颜色
					}
					//落棋
					{
						ac:"Action",
						x:0-14,
						y:0-14,
						piece:1/2
					}
					//悔棋请求
					{
						ac:"ApplyBack"
					}
					//悔棋
					{
						ac:"Back",
						step:1-n  悔棋步数
					}
				*/
				if(json.ac == "EnterRoom"){
					//进入游戏房间等待开局
					this._OnlineInitRoom(); //初始化房间
				}else if(json.ac == "ApplyRoomResult"){
					if(json.value == 1){
						this._WaitingFriendPNG.Visible(true);
					}
				}else if(json.ac == "ReadyResult"){
					var Mine = json.mine;
					var Fri = json.friend;
					//更新准备按钮
					if(Mine == 1){
						this._ReadyButton.Action("SetStatus()",1);
					}else{
						this._ReadyButton.Action("SetStatus()",0);
					}
					if(Fri == 1){
						this._FriReadyButton.Action("SetStatus()",3);
					}else{
						this._FriReadyButton.Action("SetStatus()",2);
					}
					this._ReadyButton.Visible(true);
					this._FriReadyButton.Visible(true);
				}else if(json.ac == "ColorResult"){
					var Mine = json.mine; //我方执棋颜色
					//网络对战游戏开始
					this._OnlineStart(Mine);
				}else if(json.ac == "Down"){
					var x = json.x;
					var y = json.y;
					this._GameControl.Down2(x,y);
				}else if(json.ac == "Winner"){
					//console.log(data.data);
					this._OnlineInitRoom();
				}else if(json.ac == "ReEnterRoom"){//对手离开房间返回匹配界面
					//console.log(data.data);
					this._BackToSelectFriPage();
				}
			}
		},
		_OnlineInitRoom:function(){ //初始化房间并进入
			
			this._NewGameButton.Visible(false);
			this._ReadyButton.Action("SetStatus()",0);
			this._ReadyButton.Visible(true);
			this._FriReadyButton.Action("SetStatus()",2);
			this._FriReadyButton.Visible(true);
			this._BackButton.Visible(false);
			this._StartStatus = false;
			this._Animation.SelectPage(this._MainPage);
		},
		_ApplyRoom:function(key){
			//开始连接服务器并发送key等待回应
			var t = this;
			var Text = "{\"ac\":\"ApplyRoom\",\"key\":\""+key+"\"}";
			if(!this._Server.Open){
				this._Server.OnOpen = function(){
					//发送key值申请房间
					var Text = "{\"ac\":\"ApplyRoom\",\"key\":\""+key+"\"}";
					//console.log(Text);
					t._Server.Sent(Text);
				}
				this.Connect();
			}else{
				t._Server.Sent(Text);
			}
		},
		_LoaclGameInit:function(){
			this._NewGameButton.Visible(true);
			this._ReadyButton.Visible(false);
			this._FriReadyButton.Visible(false);
			this._Animation.SelectPage(this._MainPage);
			this._GameControl.Start();
			this._BackButton.Visible(true);
		},
		_OnlineStart:function(Mine){ //我方执棋颜色 网络对战游戏开始
			this._FriReadyButton.Visible(false);
			this._ReadyButton.Visible(false);
			this._StartStatus = true;
			this._GameControl.Start();
		},
		_BackToSelectFriPage:function(){
			this._OnlineInitRoom();
			this._InitSelectRoomPage();
		},
		_InitSelectRoomPage:function(){
			//console.log(2);
			this._OnelineLink = new OneLineLink(this._NumbersButton,this._OneLine);
			this._WaitingFriendPNG.Visible(false);
			this._ReEnterRoomTIP.Visible(true);
			this._Animation.SelectPage(this._SelectRoomPage);
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
					for(var i=1;i<5;i++){
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
					count = 1;
					for(var i=1;i<5;i++){
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
					count = 1;
					for(var i=1;i<5;i++){
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
					count = 1;
					for(var i=1;i<5;i++){
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
		},
		Back:function(){
			if(this.Winner != 0)
				return false; //游戏已经结束
			//悔棋
			if(this.StepsNum == 0)
				return true;
			var step = this.Steps[--this.StepsNum];
			//清除该落点棋子
			//console.log(step);
			this.Data[step.x-1][step.y-1] = 0;
			//交换选手
			this.CurrentPlayer = this.CurrentPlayer == 1?2:1;
			return true;
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
		},
		Down2:function(x,y){
			this.GameCore.Action(x,y);
			this.Show();
			var re = this.GameCore.Check();
			if(re){
				this.WinnerPNG.Action("SetColor()",this.GameCore.Winner);
				this.MainPage.SetPosition(this.WinnerPNG,-1);
				this.WinnerPNG.Visible(true);
			}
		},
		Back:function(){
			this.GameCore.Back();
			this.Show();
		},
		CanDown:function(x,y){
			var ps = PiecePostionKit.ScreenPostion(x,y);
			if(ps.x != -1)
				return true;
			return false;
		}
	}

	var Server = function(){ //在线对战游戏引擎
		this.ServerIP = "ws://localhost";
		this.ServerPort = "8888";

		this.Open = false;

		this.OnOpen = function(){}
		this.OnMessage = function(e){}
		this.OnClose = function(){}
		this.OnErr=function(d,ds){}

		this.WS = null;
	}
	Server.fn = Server.prototype = {
		Connect:function(){ //连接对战服务器
			if("WebSocket" in window){
				var t = this;
				try{
					this.WS = new WebSocket(this.ServerIP + ":" +this.ServerPort);
				}catch(Exception){
					t.Open = false;
					this.OnErr(0,"连接发生失败");
				}
				this.WS.onopen = function(){
					t.Open = true;
					console.log("服务器连接正常");
					//console.log(this.Open+"--");
					t.OnOpen();
				}
				this.WS.onmessage = function(e){
					//console.log(e.data);
					t.OnMessage(e);
				}
				this.WS.onclose = function(){
					t.Open = false;
					console.log("断开服务器连接");
					alert("与服务器断开连接，请重新开始。");
					t.OnClose();
				}
			}else{
				this.OnErr(1,"浏览器不支持WebSocket");
			}

		},
		SetInfo:function(ServerIP,ServerPort){
			this.ServerIP = ServerIP;
			this.ServerPort = ServerPort;
		},
		Sent:function(data){
			//console.log(data);
			if(this.Open){
				this.WS.send(data);
			}
		}
	}

	var OneLineLink = function(buttons,line){ //一笔连事件
		this.Clicked = new Array();
		for(var i = 0;i<9;i++){ //9个都没有被按下
			this.Clicked[i] = 0;
		}
		this.Queue = "";
		this.Buttons = buttons;
		this.Line = line;
		this.Init();
	}
	OneLineLink.fn = OneLineLink.prototype = {
		Click:function(ob){
			//先找出索引，检查是否已经按下，未按下则增加队列并标记按下，修改按下标记
			var index = -1;
			for(var i = 0;i<9;i++){
				if(this.Buttons[i] == ob){
					index = i;
					break;
				}
			}
			if(index == -1)
				return false;
			if(this.Clicked[i] == 1)
				return true;
			this.Queue += (i+1).toString();
			this.Clicked[i] = 1;
			this.Buttons[i].Action("Clicked()",true);
			this.Line.Action("AddPoint()",this.Buttons[i].Left(),this.Buttons[i].Top());
			return true;
		},
		Init:function(){//初始化按键颜色
			for(var i = 0 ; i < 9;i++){
				this.Buttons[i].Action("Clicked()",false);
			}
			//初始化线条
			this.Line.Action("Clean()");
			this.Queue = "";
		},
		GetText:function(){
			return this.Queue;
		}
	}

})();


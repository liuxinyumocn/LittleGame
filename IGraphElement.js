var IGraphElement = [
	{
		ID:"GobangLogo",
		Version:100.00,
		Src:new Array("GobangLogo.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[0];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"Background",
		Version:100.00,
		Src:new Array("background.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				return false;
			}
		}
	},
	{
		ID:"Loading",
		Version:100.00,
		Src:new Array(),
		Class:function(){
			//初始化函数 
			this.Finished = 0;
			this.Total = Math.PI*2;
			this.Constructor = function(){
				
			}
			this.Finish = function(v){
				this.Finished = this.Total*v;
			}
			this.Draw = function(ctx){
				ctx.beginPath();
				ctx.arc(this.Left,this.Top,50,0,this.Finished,false);
				//ctx.fillStyle = "rgba(205,205,205,0.5)";
				ctx.lineWidth = 15;
				ctx.strokeStyle = "rgb(75,177,226)";
				ctx.stroke();
				ctx.closePath();
			}
			this.Over = function(){
				
			}
		}
	},
	{
		ID:"BeginGameButton",
		Version:100.00,
		Src:new Array("BeginGame.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[0];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"NewGameButton",
		Version:100.00,
		Src:new Array("NewGame.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[0];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"BattleOnlineButton",
		Version:100.00,
		Src:new Array("BattleOnline.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[0];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"Board",
		Version:100.00,
		Src:new Array(),
		Class:function(){
			//成员变量
			this.LineColor;
			this.LineWeigth;
			this.LinexCount;
			this.LineyCount;
			this.Width;
			this.Height;
			this.Gap;
			this.Numberx;
			this.Numbery;
			this.FontColor;
			this.FontSize;
			this.FontFamily;
			this.Point;
			//初始化函数 
			this.Constructor = function(){
				//对成员变量赋初值
				this.LineColor = "rgb(250,250,250)";
				this.LineWeigth = 1;
				this.LinexCount = 15;
				this.LineyCount = 15;
				this.Gap = 40;
				this.Numberx = new Array("A","B","C","D","E","F","G","H","I","G","K","L","M","N","O");
				this.Numbery = new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);
				this.FontColor = "rgb(200,200,200)";
				this.FontSize = 16;
				this.FontFamily = "宋体";
				this.Point = new Array(4,4,4,12,12,4,12,12,8,8);
			}
			this.Draw = function(ctx){
				ctx.beginPath();
				ctx.lineWidth = this.LineWeigth;
				//定义线条绘制的左上角起点，用于方便未来增加外围字母编号空隙
				var left = this.Left+this.FontSize+20;
				var top = this.Top+this.FontSize+20;
				for(var x=0;x<this.LinexCount;x++){
					ctx.moveTo(left+x*this.Gap,top);
					ctx.lineTo(left+x*this.Gap,top+(this.LineyCount-1)*this.Gap);
				}

				for(var y=0;y<this.LineyCount;y++){
					ctx.moveTo(left,top+y*this.Gap);
					ctx.lineTo(left+(this.LinexCount-1)*this.Gap,top+y*this.Gap);
				}
				ctx.strokeStyle = this.LineColor;
				ctx.stroke();
				ctx.closePath();

				//增加编号和字母
				ctx.fillStyle = this.FontColor;
				ctx.font = this.FontSize+"px "+this.FontFamily;
				for(var x=0;x<this.Numberx.length;x++){
					ctx.fillText(this.Numberx[x],this.Left+30+x*this.Gap,this.Top+this.FontSize);
				}
				for(var y=0;y<this.Numbery.length;y++){
					ctx.fillText(this.Numbery[y],this.Left+this.FontSize-15,this.Top+40+y*this.Gap);
				}
				//增加5个加重的圆点 坐标点为 4D 4L 12D 12L 8H
				for(var i=0;i<this.Point.length;i++){
					var x = this.Point[i++]-1;
					var y = this.Point[i]-1;
					ctx.beginPath();
					ctx.arc(left+x*this.Gap,top+y*this.Gap,4,0,Math.PI*2,true);
					ctx.fillStyle = this.LineColor;
					ctx.fill();
					ctx.closePath();
				}

				return true;
			}
			this.Over = function(){
						
				return false;
			}
		}
	},
	{
		ID:"Piece",
		Version:100.00,
		Src:new Array(),
		Class:function(){
			this.Color;
			//初始化函数 
			this.SetWhite = function(){	//将棋子变成白色
				this.Color = "rgb(205,205,205)";
			}
			this.SetBlack = function(){	//将棋子变成白色
				this.Color = "rgb(50,50,50)";
			}
			this.Constructor = function(){
				this.SetBlack();
			}
			this.Draw = function(ctx){
				ctx.beginPath();
				ctx.arc(this.Left,this.Top,18,0,Math.PI*2,true);
				ctx.fillStyle = this.Color;
				ctx.fill();
				ctx.closePath();
				return true;
			}
			this.Over = function(){		
				return false;
			}
		}
	},
	{
		ID:"Sight",
		Version:100.00,
		Src:new Array(),
		Class:function(){
			this.Color;
			this.Radius;
			this.LineWeigth;
			this.Length;
			//初始化函数 
			this.Constructor = function(){
				this.Color = "rgb(200,200,200)";//默认为黑色
				this.Radius = 20;
				this.LineWeigth = 1;
				this.Length = 5;
			}
			this.Draw = function(ctx){
				ctx.beginPath();
				ctx.lineWidth = this.LineWeigth;

				var x1,x2,y1,y2;
				x1 = this.Left-this.Radius;
				x2 = this.Left+this.Radius;
				y1 = this.Top-this.Radius;
				y2 = this.Top+this.Radius;

				ctx.moveTo(x1+this.Length,y1);
				ctx.lineTo(x1,y1);
				ctx.lineTo(x1,y1+this.Length);
				
				ctx.moveTo(x2-this.Length,y2);
				ctx.lineTo(x2,y2);
				ctx.lineTo(x2,y2-this.Length);

				ctx.moveTo(x1+this.Length,y2);
				ctx.lineTo(x1,y2);
				ctx.lineTo(x1,y2-this.Length);
				
				ctx.moveTo(x2-this.Length,y1);
				ctx.lineTo(x2,y1);
				ctx.lineTo(x2,y1+this.Length);
				
				ctx.strokeStyle = this.Color;
				ctx.stroke();
				ctx.closePath();
				return true;
			}
			this.Over = function(){		
				return false;
			}
		}
	},
	{
		ID:"WinnerPNG",
		Version:100.00,
		Src:new Array("BlackWinner.png","WhiteWinner.png"),
		Class:function(){
			//初始化函数 
			this.Color;
			this.Constructor = function(){
				this.Color = 0;
			}
			this.SetColor = function(Num){
				if(Num!=2){
					this.Color = 0;
				}else{
					this.Color = 1;
				}
			}
			this.Draw = function(ctx){
				var Img = this.Src[this.Color];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[this.Color];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"PlayerPNG",
		Version:100.00,
		Src:new Array("BlackPiece.png","WhitePiece.png"),
		Class:function(){
			//初始化函数 
			this.Color;
			this.Constructor = function(){
				this.Color = 0;
			}
			this.SetColor = function(Num){
				if(Num!=2){
					this.Color = 0;
				}else{
					this.Color = 1;
				}
			}
			this.Draw = function(ctx){
				var Img = this.Src[this.Color];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[this.Color];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"BackButton",
		Version:100.00,
		Src:new Array("BackPNG.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[0];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"SelectRoomTIP",
		Version:100.00,
		Src:new Array("SelectRoomTIP.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){		
				return false;
			}
		}
	},
	{
		ID:"WaitingFriend",
		Version:100.00,
		Src:new Array("waitingfriend.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
				
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){		
				return false;
			}
		}
	},
	{
		ID:"ReadyPNG",
		Version:100.00,
		Src:new Array("Ready.png","cancelReady.png","UnReady.png","Readyed.png"),
		Class:function(){
			//初始化函数 
			this.Ready;
			this.SetStatus = function(v){
				this.Ready = v;
				return v;
			}
			this.GetStatus = function(){
				return this.Ready;
			}
			this.Constructor = function(){
				this.Ready = 0;
			}
			this.Draw = function(ctx){
				var Img = this.Src[this.Ready];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[this.Ready];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"ReEnterRoomPNG",
		Version:100.00,
		Src:new Array("reenterroom.png"),
		Class:function(){
			//初始化函数 
			this.Constructor = function(){
	
			}
			this.Draw = function(ctx){
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				var Img = this.Src[0];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"Number",
		Version:100.00,
		Src:new Array("1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png"),
		Class:function(){
			//初始化函数 
			this.lineWidth;
			this.Color;
			this.Number;
			this.Constructor = function(){
				this.lineWidth = 3;
				this.Color = "rgb(205,205,205)";
				this.Number = 1;
			}
			this.SetNumber = function(i){
				this.Number = i;
			}
			this.Clicked = function(v){
				if(v){
					this.Color = "rgb(244,40,27)";
				}else{
					this.Color = "rgb(205,205,205)";
				}
			}
			this.Draw = function(ctx){
				var Img = this.Src[this.Number-1];
				ctx.drawImage(Img,this.Left-Img.width/2,this.Top-Img.height/2,Img.width,Img.height);
				//画外边圆圈
				ctx.beginPath();
				ctx.arc(this.Left,this.Top,40,0,Math.PI*2,true);
				ctx.lineWidth = this.lineWidth;
				ctx.strokeStyle = this.Color;
				ctx.stroke();
				ctx.closePath();
				return true;
			}
			this.Over = function(){		
				var Img = this.Src[0];
				var x = this.Left > 0 ? this.Left : 0-this.Left;
				var y = this.Top > 0 ? this.Top : 0-this.Top;
				if(x <= Img.width/2 && y <= Img.height/2)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"OneLine",
		Version:100.00,
		Src:new Array(),
		Class:function(){
			//初始化函数 
			this.Point;
			this.Num = 0;
			this.lineWidth;
			this.Color;
			this.Constructor = function(){
				this.Point = new Array();
				this.Num = 0;
				this.lineWidth = 5;
				this.Color = "rgb(244,40,27)";
			}
			this.AddPoint = function(X,Y){
				this.Point[this.Num++] = {x:X,y:Y};
			}
			this.Clean = function(){
				this.Point = new Array();
				this.Num = 0;
			}
			this.Draw = function(ctx){
				if(this.Num > 1){
					ctx.beginPath();
					ctx.lineWidth = this.lineWidth;
					ctx.moveTo(this.Point[0].x,this.Point[0].y);
					for(var i = 1;i<this.Num;i++){
						ctx.lineTo(this.Point[i].x,this.Point[i].y);
					}
					ctx.strokeStyle = this.Color;
					ctx.lineJoin="round";
					ctx.stroke();
					ctx.closePath();
				}

				return true;
			}
			this.Over = function(){		
				return false;
			}
		}
	}
];
/*
	访问图片数据使用：
	this.Src[0];
	访问自己标准属性使用：
	this.Self;
	读取自己绝对Left坐标：
	this.Left; //不能用于设置
	读取自己绝对Top坐标：
	this.Top;
	设置自己绝对Left坐标：
	this.Self.Left();
	设置自己绝对Top坐标：
	this.Self.Top();

	例如：
		this.Self.Visible(false); //设置自己不可视

	抽象出来的公共成员变量 无需设置
	Left();
	Top();
	Visible();
	Scale();
	Rotate();

	{
		ID:"ball",
		Version:100.00,
		Src:new Array("ball.png"),
		Class:function(ctx){
			//this._ctx = ctx;
			this.H;

			this.Hello = function(){
				return this.Self.Left();
			}
			//初始化函数 // 要求除了ctx外的所有
			this.Constructor = function(){
				this.H = "2";
			}
			this.Draw = function(ctx){
				//Rate 为比例参数 标准为1 x,y为绝对绘制坐标点，无需进行自我转换。
				ctx.drawImage(this.Src[0],this.Left,this.Top,110,110);
				return true;
			}
			this.Over = function(){
				//x,y为落点坐标，请根据落点已经当前所处位置提供是否被选中结果
				//this.Left 与 this.Top 当前都是O坐标系下的
				//整个判断都处于比率为1
				
				return false;
			}
		}
	}

*/
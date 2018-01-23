var IGraphElement = [
	{
		ID:"BattleOfBallLogo",
		Version:100.00,
		Src:new Array("BattleOfBall.png"),
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
		ID:"Background",
		Version:100.00,
		Src:new Array(),
		Class:function(){
			//初始化函数 
			this.Width;
			this.Heigth;
			this.Length;
			this._L;
			this._T;
			this.Color;
			this.AddLeft=function(V){
				this._L += V;
				this._L = this._L < 0 ? this._L + this.Length : this._L;
				this._L = this._L % this.Length;
			}
			this.AddTop=function(V){
				this._T += V;
				this._T = this._T < 0 ? this._T + this.Length : this._T;
				this._T = this._T % this.Length;
			}

			this.Constructor = function(){
				this.Length = 30;
				this._L=0;
				this._T=0;
				this.Color = "rgb(200,200,200)";
			}
			this.Draw = function(ctx){
				ctx.beginPath();
				ctx.lineWidth = 0.5;
				ctx.moveTo(this.Left+this._L+this.Width/2,this.Top+this._T);
				ctx.lineTo(this.Left+this._L-this.Width/2,this.Top+this._T);
				for(var i = 1 ;i<this.Heigth/2;i++){
					ctx.moveTo(this.Left+this._L+this.Width/2,this.Top+this._T-i*this.Length);
					ctx.lineTo(this.Left+this._L-this.Width/2,this.Top+this._T-i*this.Length);
					ctx.moveTo(this.Left+this._L+this.Width/2,this.Top+this._T+i*this.Length);
					ctx.lineTo(this.Left+this._L-this.Width/2,this.Top+this._T+i*this.Length);
				}
				ctx.moveTo(this.Left+this._L,this.Top+this._T+this.Heigth/2);
				ctx.lineTo(this.Left+this._L,this.Top+this._T-this.Heigth/2);
				for(var i = 1 ;i<this.Width/2;i++){
					ctx.moveTo(this.Left+this._L+i*this.Length,this.Top+this._T+this.Heigth/2);
					ctx.lineTo(this.Left+this._L+i*this.Length,this.Top+this._T-this.Heigth/2);
					ctx.moveTo(this.Left+this._L-i*this.Length,this.Top+this._T+this.Heigth/2);
					ctx.lineTo(this.Left+this._L-i*this.Length,this.Top+this._T-this.Heigth/2);
				}
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
		ID:"Ball",
		Version:100.00,
		Src:new Array("Arrow.png"),
		Class:function(){
			//初始化函数 
			this.Radius;
			this.Color;
			this.Constructor = function(){
				this.Radius = 20;
				this.Color = "rgb(91,91,91)";
			}
			this.Draw = function(ctx){
				ctx.beginPath();
				ctx.arc(this.Left,this.Top,this.Radius,0,Math.PI*2,true);
				ctx.closePath();
				ctx.fillStyle = this.Color;
				ctx.fill();
				var Img = this.Src[0];
				ctx.drawImage(Img,this.Left+this.Radius,this.Top-Img.height/2,Img.width,Img.height);
				return true;
			}
			this.Over = function(){
				if(this.Left*this.Left + this.Top * this.Top <= this.Radius*this.Radius)
					return true;		
				return false;
			}
		}
	},
	{
		ID:"Info",
		Version:100.00,
		Src:new Array(),
		Class:function(){
			//初始化函数 
			this.Text;
			this.fontSize;
			this.fontFamily;
			this.fontColor;
			this.Constructor = function(){
				this.Text = "当前体重为：100kg";
				this.fontSize = 20;
				this.fontFamily = "宋体";
				this.fontColor = "rgb(200,200,200)";
			}
			this.Draw = function(ctx){
				ctx.fillStyle = this.fontColor;
				ctx.font = this.fontSize+"px "+this.fontFamily;
				ctx.fillText(this.Text,this.Left,this.Top+this.fontSize);
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
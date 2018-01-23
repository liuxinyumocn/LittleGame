//IAnimation
//Version 1.0.0

//Canvas动画引擎插件

//在动画引擎载入之前必须载入 IGraphElement.js 文件
var IAnimation;
(function(){
	//工具函数	Start
	function CheckArg(Ob){
		var Type = typeof Ob;
			if(Type == "string" || Type == "number" || Type == "boolean")
				return true;
			return false;
	}
	function CheckStringFunction(Str){ //检测字符串属于函数还是属性
		if(Str.length > 2 && Str.substr(Str.length-2,Str.length) == "()")
			return true;
		return false;
	}

	function JSONParser(Str){
		var json = null;
		try{
			eval("json = "+Str);
		}
		catch(e){
			return false;
		}
		return json;
	}

	//工具函数	End
	//IAnimation 组件 Start
	IAnimation = function(Container,Json){ //提供容器对象 初始化Json数据

		//创建Canvas
		this._Container = Container;
		Container.oncontextmenu = function(){return false;}
		Container.onselectstart = function(){return false;}
		this._Canvas = document.createElement("canvas");
		Container.appendChild(this._Canvas);
		this.Width = 0;
		this.Heigth = 0;

		this._Title = "Untitle";
		this._Version = 100.00;

		//Page资源
		this._Pages = new Array();
		this._PagesSum = 0;
		this.CurrentPage = null;//当前激活渲染页面
		this._AutoDraw = true;//自动渲染标识

		this._VirtualOriginPoint = {x:0,y:0};
		this._Rate = 1;
		//初始化Page资源
		//this.SelectPage(this.CreatePage());

		//Log资源
		this._Log = new Log(this);

		//Record
		this._Record = false;
		this._Running = false;

		//Action资源
		this._Actions = new Array();
		this._ActionsSum = 0;
		this._MainAction = null; //主动作器
		this._NowTime = 0;

			//初始化Action资源
			this.CreateAction();

		//Event
		this.DownloadIMGing = function(Total,FinishNum){} //加载进度事件
		this.OnRun = function(){}
		this.OnStop = function(){}

		//Debug
		this._Debug = false;

		if(Json == null){//不执行json解析
			this._AddAction(this,"_Initialize()");
		}else{
			//执行JSON解析
			if(!this._JSON(Json)){
				//console.log("su");
				return false; //无法创建
			}
		}

		this.SetSize();
	}
	IAnimation.fn = IAnimation.prototype = {
		//-------------------渲染系统-------------------
		CreatePage:function(ID){ 
			//如果ID不为空，则查询ID 若存在ID对象则不创建，只执行初始化
			//if(ID != null){
				var ob = this._Log.IDGetObject(ID);
				if(ob != null){
					//执行Page初始化
					if(ob == this._Pages[0])
						this.SelectPage(ob);
				}
			//}
			this._ConloseLog("CreatePage","Pass");
			this._Pages[this._PagesSum++] = new RenderingPage(this._Canvas,this);
			if(this._PagesSum == 1)
				this.SelectPage(this._Pages[this._PagesSum-1]);
			this.AutoDraw();
			var id = this._Log.AddObject(this._Pages[this._PagesSum-1],ID);
			this._AddAction(this,"CreatePage()",id);
			return this._Pages[this._PagesSum-1];
		},
		SelectPage:function(PageOb){
			if(this._SearchPageID(PageOb) == -1){
				this._ConloseLog("SelectPage","Not Found Page");
				return false;
			}
			this.CurrentPage = PageOb;
			this._ConloseLog("SelectPage","Selected Page");
			this.AutoDraw();

			this._AddAction(this,"_SelectPage()",this._Log.ObjectGetID(PageOb));
			return true;
		},
		_SelectPage:function(PageObID){
			var Ob = this._Log.IDGetObject(PageObID);
			this.SelectPage(Ob);
		},
		Draw:function(){
			this._ConloseLog("Draw","Pass");
			if(this.CurrentPage != null)
				this.CurrentPage._Draw();	
			this._AddAction(this,"Draw()");
			return true;
		},
		Over:function(x,y){
			if(this.CurrentPage != null)
				return this.CurrentPage.Over(x,y);
		},
		Overs:function(x,y){
			if(this.CurrentPage != null)
				return this.CurrentPage.Overs(x,y);
		},
		SetSize:function(w,h){ //设置Canvas画布大小
			this.Width = w || this._Container.offsetWidth;
			this.Heigth = h || this._Container.offsetHeight;
			this._Canvas.width = this.Width;
			this._Canvas.height = this.Heigth;
			this._ConloseLog("SetSize","Set - width:"+this.Width+" | height:"+this.Heigth);
			this.AutoDraw();
			this._AddAction(this,"SetSize()");
			return true;
		},
		_SearchPageID:function(PageOb){//查找Page索引
			for(var i = 0 ;i<this._PagesSum ;i++){
				if(this._Pages[i] == PageOb)
					return i;
			}
			return -1;
		},
		DownloadIMG:function(Arr){ //静态方法可对全局缓存 参数提供元素对象数组
			IMGCanvasLib.Load(Arr,this.DownloadIMGing);
			this._ConloseLog("DownloadIMG","Pass");
			return true;
		},
		AutoDraw:function(Status){ //自动渲染开关
			//console.log(Status);
			if(Status==null){
				this._ConloseLog("AutoDraw","Get - Status:"+this._AutoDraw);
				if(this._AutoDraw)
					this.Draw();
				return this._AutoDraw;
			}
			//console.log(2);
			this._AutoDraw = Status;
			this._ConloseLog("AutoDraw","Set - Status:"+this._AutoDraw);
			return true;
		},
		Rate:function(r){
			if(r==null){
				this._ConloseLog("Rate","Get - Status:"+this._Rate);
				return this._Rate;
			}
			if (r<=0.01){
				this._ConloseLog("Rate","Set - Illegal Rate Argument");
				return false;
			}
			this._Rate=r;
			this._ConloseLog("Rate","Set - Status:"+this._Rate);
			this.AutoDraw();
			this._AddAction(this,"Rate()",r);
			return true;
		},
		VirtualOriginPoint:function(x,y){
			if(x==null || y==null){
				this._ConloseLog("VirtualOriginPoint","Get - x:"+this._VirtualOriginPoint.x+" | y:"+this._VirtualOriginPoint.y);
				return this._VirtualOriginPoint;
			}
			this._VirtualOriginPoint.x = x;
			this._VirtualOriginPoint.y = y;
			this._ConloseLog("VirtualOriginPoint","Set - x:"+this._VirtualOriginPoint.x+" | y:"+this._VirtualOriginPoint.y);
			this.AutoDraw();
			this._AddAction(this,"VirtualOriginPoint()",x,y);
			return true;
		},
	//-------------------名单系统-------------------
		AddWhiteList:function(Ob,FunStr){
			return this._Log.AddWhiteList(Ob,FunStr);
		},
		RemoveWhiteList:function(Ob,FunStr){
			return this._Log.RemoveWhiteList(Ob,FunStr);
		},
		AddBlackList:function(Ob,FunStr){
			return this._Log.AddBlackList(Ob,FunStr);
		},
		RemoveBlackList:function(Ob,FunStr){
			return this._Log.RemoveBlackList(Ob,FunStr);
		},
		AddSuperBlackList:function(Ob,FunStr){
			return this._Log.AddSuperBlackList(Ob,FunStr);
		},
		RemoveSuperBlackList:function(Ob,FunStr){
			return this._Log.RemoveSuperBlackList(Ob,FunStr);
		},
		GetData:function(){ //获取离线数据
			var Text = "{";
			//Title Version Time
			Text += ("Title:'" + this._Title + "',");
			Text += ("Version:"+ this._Version + ",");
			Text += ("Time:" + new Date().getTime() + ",");
			Text += ("Map:" + this._Log.GetData() + ",");
			Text += ("Action:" + this._GetActionData());
			Text += "}";
			return Text;
		},

	//-------------------动作系统-------------------
		CreateAction:function(ID){
			this._ConloseLog("CreateAction","Pass");
			var Ac = new Action(this._Log,this);
			if(this._MainAction == null){
				this._MainAction = Ac;
				var t = this;
				this._MainAction.OnStop = function(){
					t._Running = false;
					t.OnStop();
				}
			}
			this._Actions[this._ActionsSum++] = Ac;
			this._Log.AddObject(Ac,ID);
			return Ac;
		},
		//RemoveAction:function(){}, 一经创建无法移除
		AddTimeout:function(){ //主动作器

		},
		Run:function(){ //主动作器
			//终止所有动作器
			this._StopAllAciton();
			this.Record(false);
			this._Running = true;
			this.OnRun();
			this._MainAction.Run();
		},
		Stop:function(){ //主动作器
			this._MainAction.Stop();
			this.OnStop();
			this._Running = false;
		},
		_AddAction:function(){
			if(!this._Running){
				if(this._Record)
				{
					var Now = new Date().getTime();
					var d = Now - this._NowTime;
					if(d > 1){
						this._MainAction.AddAction(d);
						this._NowTime = Now;
					}
				}
				var R = this._Log.SObject.apply(this._Log,arguments);
				if(R)
				this._MainAction.AddAction.apply(this._MainAction,arguments);
			}
		},
		_Initialize:function(){
			//初始化所有部件
				//Initialize Page
				//Initialize Element

			for(var i = 0 ;i < this._PagesSum;i++){
				this._Pages[i]._Initialize();
			}
			this.AutoDraw();
		},
		_StopAllAciton:function(){
			for(var i = 0;i<this._Actions;i++){
				this._Actions[i].Stop();
			}
		},
		_GetActionData:function(){
			var Text = "{Version:1.0,";
			Text += "Data:[";
			for(var i = 0 ;i < this._ActionsSum;i++){
				Text += this._Actions[i].GetData();
				if(i != this._ActionsSum-1)
					Text+=",";
			}
			Text += "]}";
			return Text;
		},
		_ActionSetData:function(Ob){
			//创建动作器
			for(var i = 1;i<Ob.Data.length;i++){
				if(this.CreateAction(Ob.Data[i].ID) == -1)
					return false;
			}
			for(var i = 0;i<this._ActionsSum;i++){
				if(!this._Actions[i].SetData(Ob.Data[i].D))
					return false;
			}
			return true;
		},
	//-------------------其他函数-------------------
		Record:function(Status){
			if(Status == null){
				return this._Record;
			}
			this._Record = Status;
			if(Status == true)
				this._NowTime = new Date().getTime();
			return true;
		},
		Destructor:function(){
			this._Container.removeChild(this._Canvas);
			this._ConloseLog("Destructor","Pass");
		},
		Debug:function(s){
			if(s==null)
				return this._Debug;
			this._Debug = s;
			return true;
		},
		_ConloseLog:function(Origin,Info){ //Debug 调试输出信息
			if(this._Debug)
				console.log("Debug:IAnimation - Origin:"+Origin+" Info:"+Info);
		},
		printMap:function(){
			console.log(this._Log._Map.List);
		},
		printMainAction:function(){
			console.log(this._MainAction._Data);
		},
		RootDir:function(Dir){
			var T = Dir.substr(Dir.length-1,Dir.length);
			if(T == "/" || T == "\\")
				IMGCanvasLib.RootDir = Dir;
			else
				IMGCanvasLib.RootDir = Dir+"/";
			this._AddAction(this,"RootDir()",Dir);
			return true;
		},
		Title:function(Name){
			if(Name == null)
				return this._Title;
			this._Title = Name;
			return true;
		},
		_JSON:function(Json){
			var Ob = JSONParser(Json);
			if(Ob == false){
				console.log("Json");
				return false;
			}
			//版本判断

			//基本信息设置
			if(!this.Title(Ob.Title)){
				console.log("Title");
				return false;
			}
			//Map导入
			if(!this._Log.SetData(Ob.Map)){
				console.log("Map");
				return false;
			}
			//Action导入
			if(!this._ActionSetData(Ob.Action)){
				console.log("Action");
				return false;
			}

			return true;
		}
	}
	//IAnimation End

	//RenderingPage 组件 Start
	var RenderingPage = function(Canvas,Animation){
		this._Canvas = Canvas;
		this._Animation = Animation;
		this._Element = new Array();
		this._ENum = 0;
		this._Rate = 1;
		//this._AutoDraw = AutoDrawStatus || true;
		if(!this._Canvas.getContext){
			return false;
		}else{
			this._ctx = this._Canvas.getContext("2d");
			return true;
		}
	}
	RenderingPage.fn = RenderingPage.prototype = {
		AddElement:function(Name,index,ID){//index 插入索引位置缺省或不合法索引值将尾部插入，0起，索引号小的为底层
				var ob = this._Animation._Log.IDGetObject(ID);
				if(ob != null){
					//执行初始化
					this.SetPosition(ob,index);
					ob.Action("Constructor()");
					return ob;
				}
			var IMG;
			index = index || -1;
			if(index<0 || index > this._ENum)
				index = this._ENum;
			IMG = IMGCanvasLib.Search(Name);
			if(IMG == null)
				return false;
			//装填到抽象对象元素中
			var Ab = new AbstractGraphElement(IMG,this._ctx,this._Animation._AddAction,this);
			//向后移位
			for(var i = this._ENum-1 ;i>index ;i--){
				this._Element[i+1] = this._Element[i];
			}
			//插入
			this._Element[index] = Ab;
			this._ENum++;
			//this._Element[index].MID = this._id++;
			this.AutoDraw();
			var id = this._Animation._Log.AddObject(this._Element[index],ID);
			this._AddAction(this,"AddElement()",Name,index,id);
			return this._Element[index];
		},
		DelElement:function(Ob){
			//Search
			/* 没有删除元素，仅仅是将元素隐藏
			var i;
			for(i=0;i<this._ENum;i++){
				if(this._Element[i] == Ob){
					break;
				}
			}
			if (i == this._ENum) { //没有该元素
				return false;
			}
			for(;i<this._ENum-1;i++){
				this._Element[i] = this._Element[i+1];
			}
			this._Element[this._ENum-1] =null;
			this._ENum--;
			*/
			if(this._CheckElement(Ob))
				Ob.Visible(false);

			this.AutoDraw();
			return true;
		},
		GetPosition:function(Ob){
			for(var i=0;i<this._ENum;i++){
				if (Ob == this._Element[i])
					return i;
			}
			return -1;
		},
		SetPosition:function(Ob,index){//index -1最顶层 0最底层 留空默认最顶层
			//调整元素位置
			//index = index || this._ENum-1;
			this._AddAction(this,"_SetPosition()",this._Animation._Log.ObjectGetID(Ob),index);
			if(index == null)
				index = this._ENum-1;
			if(index < 0 || index >= this._ENum)
				index = this._ENum-1;
			var p=0,rr=false;
			for(p=0;p<this._ENum;p++)
			{
				if (this._Element[p] == Ob) {
					//p是Ob当前位置
					rr = true;
					break;
				}
			}
			if(rr == false)
				return false; //不是本Page中的元素
			if (p == index) {
				//this.AutoDraw();
				return true;
			}
			var O;
			O = this._Element[p];
			if (p > index)
			{
				//往下设置
				for(;p>index;p--){
					this._Element[p] = this._Element[p-1];
				}
				this._Element[index] = O;
			}else{
				//往上设置
				for(;p<index;p++){
					this._Element[p] = this._Element[p+1];
				}
				this._Element[index] = O;
			}
			this.AutoDraw();
			return true;
		},
		_SetPosition:function(ID,index){
			this.SetPosition(this._Animation._Log.IDGetObject(ID),index);
		},
		Over:function(x,y){
			var r = this.Overs(x,y);
			if(r == null)
				return null;
			return r[0];
		},
		Overs:function(x,y){
			var Obs = new Array();
			for(var i = this._ENum - 1 ; i>=0;i--){
				R = this._Element[i].Over(x,y,this._Rate);
				if(R == true){
					Obs[Obs.length] = this._Element[i];
				}
			}
			if (Obs.length == 0)
				return null;
			return Obs;
		},
		ClearScreen:function(x1,y1,x2,y2){
			x1 = x1 || 0;
			y1 = y1 || 0;
			x2 = x2 || this._Canvas.width;
			y2 = y2 || this._Canvas.height;
			this._ctx.clearRect(x1,y1,x2,y2);
			return true;
		},
		AutoDraw:function(){
			//console.log(3);
			this._Animation.AutoDraw();
		},
		//SetAutoDraw:function(Status){
		//	this._AutoDraw = Status;
		//},
		_Draw:function(Ob){
			if (Ob == null) {
				this.ClearScreen();
				for(var i=0;i<this._Element.length;i++){
					this._Element[i].Draw(this.GetRate());
				}
				return true;
			}
		},
		_CheckElement:function(Ob){
			for(var i = 0 ; i < this._ENum;i++)
				if (this._Element[i]==Ob)
					return true;
			return false;
		},
		GetVirtualOriginPoint:function(){
			return this._Animation.VirtualOriginPoint();
		},
		GetRate:function(){
			return this._Animation.Rate();
		},
		_AddAction:function(){
			this._Animation._AddAction.apply(this._Animation,arguments);
		},
		_Initialize:function(){
			for(var i = 0 ; i < this._ENum ; i++){
				this._Element[i]._Initialize();
			}
		}
	}
		//元素抽象组件 Start
		var AbstractGraphElement = function(GraphElement,ctx,ActionHandle,PageHandle,ID){
			this._ctx = ctx;
			this._GraphElement = new GraphElement();
			this._GraphElement.Constructor();
			this._GraphElement.Self = this;
			this._ActionHandle = ActionHandle;
			this._PageHandle = PageHandle;

			this._Scale_h = 1;
			this._Scale_w = 1;
			this._Angle = 0;

			//this.IAnimationHandle = null;

			this._OLeft = 0; //基于O坐标系的
			this._OTop = 0;

			this._Visible = false;

			this._PageHandle._Animation._Log.AddObject(this._GraphElement,ID);

		}
		AbstractGraphElement.fn = AbstractGraphElement.prototype = {
			Left:function(left){ //导入的是基于Canvas容器的绝对坐标
				//计算出基于O坐标系方位坐标
				if(left == null){
					var Rate = this._PageHandle.GetRate();
					return this._OLeft*Rate+ this._PageHandle.GetVirtualOriginPoint().x;
				}
				this._OLeft = (left - this._PageHandle.GetVirtualOriginPoint().x) / this._PageHandle.GetRate();
				this._AutoDraw();
				this._AddAction(this,"Left()",left);
			},
			Top:function(top){
				//计算出基于O坐标系方位坐标
				if(top == null){
					var Rate = this._PageHandle.GetRate();
					return this._OTop*Rate+ this._PageHandle.GetVirtualOriginPoint().y;
				}
				this._OTop = (top - this._PageHandle.GetVirtualOriginPoint().y) / this._PageHandle.GetRate();
				this._AutoDraw();
				this._AddAction(this,"Top()",top);
			},
			Visible:function(Status){
				if(Status == null)
					return Status;
				this._Visible = Status;
				this._AutoDraw();
				this._AddAction(this,"Visible()",Status);
				return true;
			},
			Scale:function(Rate,h){
				//如果仅填写一个参数，则根据整体进行比例放大与缩小，若填写两个参数，则缩放当前元素绘图的宽度以及高度 1 = 100% 0.5 = 50% 注意该操作仅对当前元素有效且永久有效 如需还原输入1,1
				if(Rate == null)
					return {w:this._Scale_w,h:this._Scale_h};
				if(Rate <=0 )
					return false;
				this._Scale_w = Rate;
				this._Scale_h = h || Rate;
				this._AutoDraw();
				this._AddAction(this,"Scale()",this._Scale_w ,this._Scale_h);
				return true;
			},
			Rotate:function(Angle){ //弧度制，圆周率需使用Math.PI 注意该操作仅对当前元素有效且永久有效 如需还原输入 0 
				if (Angle == null) {
					return this._Angle;
				}
				this._Angle = Angle || 0;
				this._AutoDraw();
				this._AddAction(this,"Rotate()",Angle);
				return true;
			},
			Action:function(){
				/*
					不定量参数
				*/
				var ArgsAc = new Array();
				ArgsAc[0] = this;
				ArgsAc[1] = "Action()";
				for(var i = 0 ; i < arguments.length;i++){
					ArgsAc[i+2] = arguments[i];
				}
				this._AddAction.apply(this,ArgsAc);

				var Arg1 = arguments[0];
				var Arg1Type = typeof Arg1;
				if(Arg1Type != "string")
					return false; //错误的数据类型参数
				if(CheckStringFunction(Arg1)) //对象方法
				{
					//生成函数参数字符串
					var ArgsText = "";
					if(arguments.length>1){
						for(var i = 1;i<arguments.length;i++){
							ArgsText += "arguments["+i+"]";
							if(i<arguments.length-1)
								ArgsText += ",";
						}
					}

					var MethodName = Arg1.substr(0,Arg1.length-2);
					//执行函数
					try{	//执行函数方法时会自动重绘一次
						var r = eval("this._GraphElement."+MethodName+"("+ArgsText+");");
						this._AutoDraw();
						return r;
					}
					catch(e){
						console.log("错误的自定义成员方法");
						return false;
					}
				}else{
					//执行属性赋值
					try{
						if(arguments.length == 1)
							return eval("this._GraphElement."+Arg1);
						return eval("this._GraphElement."+Arg1+"=arguments[1];");
					}
					catch(e){
						console.log("错误的自定义成员属性");
						return false;
					}
				}

			},
			Draw:function(){
				if(this._Visible == false)
					return true;
				var Rate = this._PageHandle.GetRate();
				var VirtualOriginPoint = this._PageHandle.GetVirtualOriginPoint();
				var Nx = this._OLeft*Rate+ VirtualOriginPoint.x; //如果没有 Scale 的位置
				var Ny = this._OTop*Rate+ VirtualOriginPoint.y;
				Nx /= this._Scale_w;
				Ny /= this._Scale_h;
				this._GraphElement.Left = Nx * Math.cos(this._Angle) + Ny * Math.sin(this._Angle); //调整旋转坐标
				this._GraphElement.Top = Ny * Math.cos(this._Angle) - Nx * Math.sin(this._Angle);
				this._ctx.scale(this._Scale_w*Rate,this._Scale_h*Rate);
				this._ctx.rotate(this._Angle);
				this._GraphElement.Draw(this._ctx);
				this._ctx.rotate(0-this._Angle);
				this._ctx.scale(1/this._Scale_w/Rate,1/this._Scale_h/Rate);
				return true;
				//根据O坐标系、比率、偏移计算出实际落点
				//并调用具体元素Draw方法，传入 Left 与 Top信息
			},
			Over:function(x,y){ //x,y提供 绝对坐标
				/*
					传入的是绝对的落点坐标，引擎经过自行计算，得出该落点在O坐标系下的坐标 传给.Left 与.Top 并使元素Left Top都为0时

					需要解决的问题：
					1，对于已经发生缩放的
					2，对于已经发生旋转的
				*/
				if(this._Visible == false)
					return false;
				var Rate = this._PageHandle.GetRate();
				//var VirtualOriginPoint = this._PageHandle.GetVirtualOriginPoint();
				var Ox,Oy;

				Ox = x - this.Left();
				Oy = y - this.Top();
				var ox = Ox * Math.cos(-this._Angle) - Oy * Math.sin(-this._Angle); //反向旋转坐标
				var oy = Oy * Math.cos(-this._Angle) + Ox * Math.sin(-this._Angle);
				ox /= (this._Scale_w * Rate);
				oy /= (this._Scale_h * Rate);
				this._GraphElement.Left = ox;
				this._GraphElement.Top = oy;
				return this._GraphElement.Over();
			},
			_AutoDraw:function(){
				this._PageHandle.AutoDraw();
			},
			_AddAction:function(){
				this._ActionHandle.apply(this._PageHandle._Animation,arguments);
			},
			_Initialize:function(){
				this._Scale_h = 1;
				this._Scale_w = 1;
				this._Angle = 0;
				this._OLeft = 0;
				this._OTop = 0;
				this._Visible = false;
				this._GraphElement.Constructor();
			}
		}
		//元素抽象组件 End
		//元素检索器 Start

		//元素检索器 End
	//RenderingPage 组件

	//Log 组件 Start
		var ObLogInfo = function(Ob,FunStr){
			this.Ob = Ob;
			this.FunStr = FunStr;
		}
	var Log = function(IAnimation){
		this._Map = new _Map();
		this._Animation = IAnimation;
		this.AddObject(IAnimation,1); //引擎对象ID永远是1
		this._WhiteList = new Array();
		this._WSum = 0;
		this._BlackList = new Array();
		this._BSum = 0;
		this._SuperBlackList = new Array();
		this._SSum = 0;
	}
	Log.fn = Log.prototype = {
		AddWhiteList:function(Ob,FunStr){
			var r = this._SearchList(this._WhiteList,this._WSum,Ob,FunStr);
			if(r.result == false)
			{
				this._WhiteList[this._WSum++] = new ObLogInfo(Ob,FunStr);
				return true;
			}
			return false;
		},
		RemoveWhiteList:function(Ob,FunStr){
			var r = this._SearchList(this._WhiteList,this._WSum,Ob,FunStr);
			if(r.result == false)
				return false ; //没有找到对应记录
			var index = 0;
			if(r.FunStr != -1)
				index = r.Fun;
			else
				index = r.Ob;
			for(var i = index+1;i<this._WSum;i++){
				this._WhiteList[i-1] = this._WhiteList[i];
			}
			this._WSum--;
			return true;
		},
		AddBlackList:function(Ob,FunStr){
			var r = this._SearchList(this._BlackList,this._BSum,Ob,FunStr);
			if(r.result == false)
			{
				this._BlackList[this._BSum++] = new ObLogInfo(Ob,FunStr);
				return true;
			}
			return false;
		},
		RemoveBlackList:function(Ob,FunStr){
			var r = this._SearchList(this._BlackList,this._BSum,Ob,FunStr);
			if(r.result == false)
				return false ; //没有找到对应记录
			var index = 0;
			if(r.FunStr != -1)
				index = r.Fun;
			else
				index = r.Ob;
			for(var i = index+1;i<this._BSum;i++){
				this._BlackList[i-1] = this._BlackList[i];
			}
			this._BSum--;
			return true;
		},
		AddSuperBlackList:function(Ob,FunStr){
			var r = this._SearchList(this._SuperBlackList,this._SSum,Ob,FunStr);
			if(r.result == false)
			{
				this._SuperBlackList[this._SSum++] = new ObLogInfo(Ob,FunStr);
				return true;
			}
			return false;
		},
		RemoveSuperBlackList:function(Ob,FunStr){
			var r = this._SearchList(this._SuperBlackList,this._SSum,Ob,FunStr);
			if(r.result == false)
				return false ; //没有找到对应记录
			var index = 0;
			if(r.FunStr != -1)
				index = r.Fun;
			else
				index = r.Ob;
			for(var i = index+1;i<this._SSum;i++){
				this._SuperBlackList[i-1] = this._SuperBlackList[i];
			}
			this._SSum--;
			return true;
		},
		_SearchList:function(List,Sum,Ob,FunStr){ //向一个列表中查询特征 !!禁止外部调用
			var r = false ,rOb = -1 , rFun = -1;
			for(var i = 0 ; i < Sum ; i++){
				if(List[i].Ob == Ob){
					if(FunStr == null){
						r = true;
						rOb = i;
						break;
					}else{
						if(FunStr == List[i].FunStr){
							r = true;
							rFun = i;
							break;
						}else{
							rOb = i;
						}
					}
				}
			}
			return {result:r,Ob:rOb,Fun:rFun};
		},
		Object:function(Ob,FunStr){ //审核元素方法是否需要被记录 从黑、白名单角度
			var rW = this._SearchList(this._WhiteList,this._WSum,Ob,FunStr);
			if(rW.result == true)
				return true; //若白名单存在确切信息则直接记录
			var rWOb = rW.Ob; //如果没找到确切信息，但找到对象信息，先保留结果 -1 为没找到
			var rB = this._SearchList(this._BlackList,this._BSum,Ob,FunStr);
			if(rB.result == true)
				return false;//若黑名单存在确切信息则直接不记录
			var rBOb = rB.Ob;
			if(rWOb != -1)
				return true;
			if(rBOb != -1)
				return false;
			return true;
			/*
				优先级顺序解释：
					白名单检索对象.函数 有：记录 无：黑名单检索对象.函数 有：不记录 无：白名单检索对象 有：记录 无：黑名单检索对象 有：不记录 无：记录
			*/
		},
		SObject:function(Ob,FunStr){ //审核元素方法是否需要被记录 从超级黑名单角度
			var rB = this._SearchList(this._SuperBlackList,this._SSum,Ob,FunStr);
			if(rB.result == true)
				return false; //有对象 不记录
			if(rB.Ob == -1)
				return true;
			return false;
			/*	
				优先级解释：
					超级黑名单有 对象 则不记录 仅有 对象.函数 则该函数不记录
			*/
		},
		//Map
		AddObject:function(Ob,ID){
			return this._Map.AddObject(Ob,ID);
		},
		ObjectGetID:function(Ob){
			return this._Map.ObjectGetID(Ob);
		},
		IDGetObject:function(ID){
			return this._Map.IDGetObject(ID);
		},
		GetData:function(){ // Map离线数据
			var Text = "{";
			Text += "Version:1.0,";
			Text += "BookList:[";
			for(var i = 0;i<this._Map.List.length;i++){
				Text +=this._Map.List[i].ID;
				if(i != this._Map.List.length-1)
					Text += ",";
			}
			Text += "]}";
			return Text;
		},
		SetData:function(Ob){
			this._Map.BookList = Ob.BookList;
			return true;
		}

	}
		//_Map Start
		var _MapOb = function(Ob,ID){
			this.Ob = Ob;
			this.ID = ID;
		}
		var _Map = function(BookList){
			this.List = new Array();
			this.BookList = [1];
		}
		_Map.fn = _Map.prototype = {
			AddObject:function(Ob,ID){
				if(ID == null){
					var id = this.ObjectGetID(Ob);
					if(id != -1)
						return id;
					this.List[this.List.length] = new _MapOb(Ob,this._UniqueID());
				}else{
					//指定ID只接受来自预定ID列表，且没有被创建的
					var id = this.ObjectGetID(Ob);
					if(id == ID)
						return id;
					if(id != -1)
						return -1; //已经存在该对象，且ID不符
					if(id == -1 && this._SearchFromBookList(ID) == false)
						return -1; //因为创建的元素所规定的ID不是 BookList 中的不允许创建
					this.List[this.List.length] = new _MapOb(Ob,ID);
				}
				return this.List[this.List.length-1].ID;
			},
			ObjectGetID:function(Ob){
				for (var i in this.List){
					if(this.List[i].Ob == Ob)
						return this.List[i].ID;
				}
				return -1;
			},
			IDGetObject:function(ID){
				if(ID == null)
					return null;
				for (var i in this.List){
					if(this.List[i].ID == ID)
						return this.List[i].Ob;
				}
				return null;
			},
			_UniqueID:function(){ //完全唯一的ID
				var id = 2;
				for (var i in this.BookList){
					if(this.BookList[i] >= id)
						id = this.BookList[i] + 1;
				}
				for (var i in this.List){
					if(this.List[i].ID >= id)
						id = this.List[i].ID + 1;
				}
				return id;
			},
			_SearchFromBookList:function(ID){
				for (var i in this.BookList)
				{
					if(this.BookList[i] == ID)
						return true;
				}
				return false;
			}
		}
		//_Map End

	//Log End

	//Action 组件 Start
		var AcOb = function(Ob,ID,Str,An){
			this._MapID = ID || -1;
			this._Ob = Ob || null;
			this._ActionText = Str || 0;
			this._An = An || null;
			// 当Ob 不为空时，执行对象动作
			// 当Ob 为空时，执行延时函数
		}
		AcOb.prototype = {
			Run:function(CallBack){ //执行完毕后发生的回调函数 若不等待或非异步则无需指定回调函数
				CallBack = CallBack || function(){};
				try{	
					if(this.IsOb()){
						//console.log(this._Ob);
						//console.log("this._Ob."+this._ActionText);
						var r = eval("this._Ob."+this._ActionText);
						CallBack();
						return r;
					}else{
						setTimeout(CallBack,this._ActionText);
						return true;
					}
				}
				catch(e){
					throw(e);
					console.log("动作器元素执行动作发生错误！");	
				}
			},
			IsOb:function(){
				if(this._Ob == null){
					if(this._MapID == -1)
					return false;
					var ob = this._An._Log.IDGetObject(this._MapID);
					if(ob == null)
						return false;
					this._Ob = ob;
					return true;
				}
				return true;
			},
			GetData:function(){ //---------------------------------------------------------------
				var Text = "{P:'";
				if(this.IsOb()){
					Text += ("Ob',ID:"+this._MapID+",AcT:'"+this._ActionText+"'}");
				}else{
					Text += ("T',AcT:"+this._ActionText+"}");
				}
				return Text;
			}
		}
	var Action = function(_Log,_Animation){
		this._Data = new Array();
		this._Num = 0;
		this._Rate = 1; //缩进率
		this._ORate = 1;
		this._Loop = 1; //计次循环 0 不合法取值 1 执行1次 2 循环2次 ... <0 无限循环 对于无限循环停止只能通过Stop终止播放。
		this._Current = 0;
		this._CurrentLoop = 0; //当前执行循环次数，该成员变量会被Run初始化。
		this._Log = _Log || null; //提供Map对象以供核验
		this._Animation = _Animation || null;

		this._Run = false;

		//Event
		this.OnRun = function(){}; //运行前触发事件
		this.OnStop = function(){};	//运行终止时触发事件
	}
	Action.fn = Action.prototype = {
		AddAction:function(){
			//console.log(arguments);
			var Arg1 = arguments[0];
			var Arg1Type = typeof Arg1;
			switch(Arg1Type){
				case "object":
					var ID = this._GetObID(Arg1);
					if(ID == -1)
						return false; //Map表中没有对应ID
					//解析动作字符串
					var Text = "";
					var Arg2 = arguments[1];
					//console.log(Arg2);
					if(CheckStringFunction(Arg2)){
						//生成函数方法字符串
						Text = Arg2.substr(0,Arg2.length-1);
						if(arguments.length > 2){
							for (var i = 2;i<arguments.length;i++){
								//先判断是
								var Type = typeof arguments[i];
								if(Type == "string"){
									Text+=("\""+arguments[i]+"\"");
								}else if(Type == "number" || Type == "boolean"){
									Text+=arguments[i];
								}else if (arguments[i] == null){
									Text+="null";
								}else{
									return false;
								}
								//-------------------------------------------------------------------------
								if(i<arguments.length-1)
									Text += ",";
							}
						}
						Text += ");";
					}else{
						//生成属性方法字符串
						Text = Arg2;
						if(arguments.length == 2)
							Text += ";";
						else
						{
							if(CheckArg(arguments[2])){
								Text += arguments[2];
								Text += ";";
							}else{
								return false; //不是基本数据类型
							}
						}
					}
					this._Data[this._Num++] = new AcOb(Arg1,ID,Text,this._Animation);
					//console.log(Text);
				break;
				case "number":
					this._Data[this._Num++] = new AcOb(null,null,Arg1);
				break;
				default:
					//不合法的数据类型
					return false;
				break;
			}
			return this._Data[this._Num-1]; //返回所创建的对象指针可用于删除
		},
		Rate:function(Value){
			if(!Value){
				return this._ORate;
			}
			if(Value<=0)
				return false; //不合法的取值范围
			this._Rate = 1/Value;
			this._ORate = Value;
			return true;
		},
		Loop:function(Value){
			if(Value == null || Value === 0){
				return this._Loop;
			}
			this._Loop = Value;
		},
		Run:function(){
			this.OnRun();
			if(this._Num == 0){ //没有可以播放的内容
				return this.Stop();
			}
			if(this._Run == true)
				return true;
			//this.OnRun();
			this._CurrentLoop = 0;
			this._Current = 0;
			this._Run = true;
			var t = this;
			var CallBack = function(T){
				if(t.IsRunning()){
					var C = t._Current;
					t._Next();
					//console.log(t._Data[C]);
					t._Data[C].Run(CallBack);
				}else{
					t.OnStop();
				}
			}
			setTimeout(CallBack,1);
			return true;
		},
		Stop:function(){
			this._Run = false;
			return true;
		},
		IsRunning:function(){
			return this._Run;
		},
		_AddSelf:function(){
			if (arguments.length == 0) {
				return false; //不合法的参数数目
			}
			var ArgsText = "";
			for(var i = 0;i<arguments.length;i++){
				ArgsText += "arguments["+i+"]";
				if(i<arguments.length -1)
					ArgsText += ",";
			}
			return eval("this.AddAction(this._Animation,"+ArgsText+")");
		},
		_GetObID:function(Ob){
			return this._Log.ObjectGetID(Ob);
		},
		_Next:function(){ //移动到下一个播放索引 当没有所需播放索引时 变更播放状态
			if(this._Num == 0){
				this.Stop();
				return true;
			}
			if(this._Current < this._Num-1)
				this._Current++;
			else {
				if(this._Loop < 0 || this._CurrentLoop < this._Loop - 1){
					//继续重头开始
					if(this._Loop > 0)
						this._CurrentLoop++;
					this._Current = 0;
				}else{
					this.Stop();
				}
			}
			return true;
		},
		GetData:function(){
			var Text = "{ID:";
			Text += this._Animation._Log.ObjectGetID(this);
			Text += ",D:[";
			for(var i = 0 ; i < this._Data.length;i++){
				Text += this._Data[i].GetData();
				if(i != this._Data.length-1)
					Text += ",";
			}
			Text += "]}";
			return Text;
		},
		SetData:function(Ob){
			for(var i = 0 ; i < Ob.length ;i++){
				if(Ob[i].P == "Ob"){
					this._Data[this._Num++] = new AcOb(null,Ob[i].ID,Ob[i].AcT,this._Animation);
				}else{
					this._Data[this._Num++] = new AcOb(null,null,Ob[i].AcT);
				}
			}
			return true;
		}
	}
	//Action End

	//Err Start

	//Err End

	//IMGCanvasLib Start
	var IMGCanvasLib = {
		RootDir:"IMG/",
		Load:function(Arr,CallBack){
			var callback = CallBack;
			var Total = 0;
			var FinishNum = 0;
			function Event(){
				callback(Total,FinishNum);
			}
			//计算总数
			for(var i in Arr){
				for(var t in IGraphElement){
					if(Arr[i] == IGraphElement[t].ID){
						if(IGraphElement[t].Src != null && IGraphElement[t].Src.length > 0)
							Total += IGraphElement[t].Src.length;
					}
				}
			}
			//console.log("总缓存数目为："+Total);
			//遍历
			for (var i in Arr){
				for(var t in IGraphElement){
					if(Arr[i] == IGraphElement[t].ID){
						if(IGraphElement[t].Src != null && IGraphElement[t].Src.length > 0){
							//进行异步缓存
							for(var z = 0;z<IGraphElement[t].Src.length;z++){
								var s = IGraphElement[t].Src[z];
								IGraphElement[t].Src[z] = new Image();
								IGraphElement[t].Src[z].src = this.RootDir + s;
								IGraphElement[t].Src[z].onload = function(){
									FinishNum++;
									Event();
								}
							}
						}
					}
				}
			}
		},
		Search:function(Name){
			for(var i in IGraphElement){
				if(IGraphElement[i].ID == Name){
					IGraphElement[i].Class.prototype = {Src:IGraphElement[i].Src};
					return IGraphElement[i].Class;
				}
			}
			return null;
		}
	}
	//IMGCanvasLib End
})();
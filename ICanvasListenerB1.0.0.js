//ICanvasListener.js
//Author Liu
//Web liuxinyumo.cn

var ICanvasListener;
(function(){
	ICanvasListener = function(Element){
		this._Element = Element;
		this._MouseMove = false ;
		this._MouseDown = false ;
		this._MouseUp = false ;
		this._MouseDBClick = false ;
		this._TouchDown = false;
		this._TouchUp = false;
		this._TouchMove = false;
		this._TouchDB = false;
		this.X = -1 ;
		this.Y = -1 ;

		this._Rate = 1;

		this._EventMouseMove = new Array();
		this._EventMouseDown = new Array();
		this._EventMouseUp = new Array();
		this._EventMouseDBClick = new Array();
		this._EventTouchMove = new Array();
		this._EventTouchDown = new Array();
		this._EventTouchUp = new Array();
		this._EventTouchDB = new Array();

		this._TouchesNum = 0;

			var t = this;
			function Handler1 (e){
				e.preventDefault();
				t.MousePosition(e.pageX,e.pageY);
				t._PaddleMouseMove();
			}
			function Handler2 (e){
				e.preventDefault();
				t.MousePosition(e.pageX,e.pageY);
				t._PaddleMouseDown();
			}
			function Handler3 (e){
				e.preventDefault();
				t.MousePosition(e.pageX,e.pageY);
				t._PaddleMouseUp();
			}
			function Handler4 (e){
				e.preventDefault();
				t.MousePosition(e.pageX,e.pageY);
				t._PaddleMouseDBClick();
			}
			function Handler5 (e){
				e.preventDefault();
				t.MousePosition(e.touches[0].pageX,e.touches[0].pageY);
				t._PaddleTouchDown();
			}
			function Handler6 (e){
				e.preventDefault();
				//t.MousePosition(e.touches[0].pageX,e.touches[0].pageY);
				t._PaddleTouchUp();
			}
			function Handler7 (e){
				e.preventDefault();
				t.MousePosition(e.touches[0].pageX,e.touches[0].pageY);
				t._PaddleTouchMove();
			}
		this._Element.addEventListener("mousemove",Handler1,true);
		this._Element.addEventListener("mousedown",Handler2,true);
		this._Element.addEventListener("mouseup",Handler3,true);
		this._Element.addEventListener("dblclick",Handler4,true);
		this._Element.addEventListener("touchstart",Handler5,true);
		this._Element.addEventListener("touchend",Handler6,true);
		this._Element.addEventListener("touchmove",Handler7,true);

	}
	ICanvasListener.fn = ICanvasListener.prototype = {
		GetTop:function(E){
			var e = E || this._Element;
			var offset = e.offsetTop;
			if(e.offsetParent != null)
				offset+=this.GetTop(e.offsetParent);
			return offset;
		},
		GetLeft:function(E){
			var e = E || this._Element;
			var offset = e.offsetLeft;
			if(e.offsetParent != null)
				offset+=this.GetLeft(e.offsetParent);
			return offset;
		},
		MousePosition:function(x,y){
			this.X = x - this.GetLeft() ;
			this.Y = y - this.GetTop() ;
		},
		MouseMove:function(Status){
			if(Status == true && this._MouseMove == false){
				this._MouseMove = true;
			}
			else if(Status == false && this._MouseMove == true){
				this._MouseMove = false;
			}
			return true;
		},
		AddEventMouseMove:function(CallBack){
			this._EventMouseMove[this._EventMouseMove.length] = CallBack;
		},
		_PaddleMouseMove : function(){
			if(this._MouseMove == true)
			for(var i = 0 ;i<this._EventMouseMove.length;i++){
				this._EventMouseMove[i]();
			}
		},
		MouseDown:function(Status){
			if(Status == true && this._MouseDown == false){
				this._MouseDown = true;
			}
			else if(Status == false && this._MouseDown == true){
				this._MouseDown = false;
			}
			return true;
		},
		AddEventMouseDown:function(CallBack){
			this._EventMouseDown[this._EventMouseDown.length] = CallBack;
		},
		_PaddleMouseDown:function(){
			if(this._MouseDown == true)
			for(var i = 0 ;i < this._EventMouseDown.length;i++){
				this._EventMouseDown[i]();
			}
		},
		MouseUp:function(Status){
			if(Status == true && this._MouseUp == false){
				this._MouseUp = true;
			}
			else if(Status == false && this._MouseUp == true){
				this._MouseUp = false;
			}
			return true;
		},
		AddEventMouseUp:function(CallBack){
			this._EventMouseUp[this._EventMouseUp.length] = CallBack;
		},
		_PaddleMouseUp:function(){
			if(this._MouseUp == true)
			for(var i = 0 ;i<this._EventMouseUp.length;i++){
				this._EventMouseUp[i]();
			}
		},
		MouseDBClick:function(Status){
			if(Status == true && this._MouseDBClick == false){
				this._MouseDBClick = true;
			}
			else if(Status == false && this._MouseDBClick == true){
				this._MouseDBClick = false;
			}
			return true;
		},
		AddEventMouseDBClick:function(CallBack){
			this._EventMouseDBClick[this._EventMouseDBClick.length] = CallBack;
		},
		_PaddleMouseDBClick:function(){
			if(this._MouseDBClick == true)
			for(var i = 0 ;i<this._EventMouseDBClick.length;i++){
				this._EventMouseDBClick[i]();
			}
		},
		TouchDown:function(Status){
			if(Status == true && this._TouchDown == false){
					this._TouchDown = true;
			}
			else if (Status == false && this._TouchDown == true){
				this._TouchDown = false;
			}
			return true;
		},
		AddEventTouchDown:function(CallBack){
			this._EventTouchDown[this._EventTouchDown.length] = CallBack;
		},
		_PaddleTouchDown:function(){
			if(this._TouchDown == true)
			for(var i = 0 ;i<this._EventTouchDown.length;i++){
				//alert(555555);
				this._EventTouchDown[i]();
			}
		},
		TouchUp:function(Status){
			if(Status == true && this._TouchUp == false){
					this._TouchUp = true;
			}
			else if (Status == false && this._TouchUp == true){
				this._TouchUp = false;
			}
		},
		AddEventTouchUp:function(CallBack){
			this._EventTouchUp[this._EventTouchUp.length] = CallBack;
		},
		_PaddleTouchUp:function(){
			if(this._TouchUp == true)
			for(var i = 0 ;i<this._EventTouchUp.length;i++){
				this._EventTouchUp[i]();
			}
		},
		TouchMove:function(Status){
			if(Status == true && this._TouchMove == false){
					this._TouchMove = true;
			}
			else if (Status == false && this._TouchMove == true){
				this._TouchMove = false;
			}
		},
		AddEventTouchMove:function(CallBack){
			this._EventTouchMove[this._EventTouchMove.length] = CallBack;
		},
		_PaddleTouchMove:function(){
			if(this._TouchMove == true)
			for(var i = 0 ;i<this._EventTouchMove.length;i++){
				this._EventTouchMove[i]();
			}
		}
	}
})();
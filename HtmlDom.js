var HtmlDomElement = function(Name,DefaultRect)
{
	this.Name = Name;
	this.Control = null;
	
	//	never access private objects!
	this.Private = {};
	DefaultRect = DefaultRect || new Math.Rect(0,0,99,99);
	this.Private.Rect = new Math.Rect( DefaultRect );
	//console.log("this.Private.Rect = " + JSON.stringify(this.Private.Rect) );
	
	//	made this a func in case it because dynamic/auto from HTML dom later
	this.GetRect = function()
	{
		return new Math.Rect( this.Private.Rect );
	}
}

//	bridge document to a Pop dom interface
Pop.HtmlDom = function()
{
	this.Elements = [];
	
	this.CreateElement = function(Name,DefaultRect)
	{
		let Element = new HtmlDomElement(Name,DefaultRect);
		this.Elements.push( Element );
		return Element;
	}
	
	//	OnMouseDown
	//	OnMouseMove
	//	OnScroll
	//	RenderTree (getting render commands)
	this.GetRenderCommands = function()
	{
		let RenderCommands = [];
		let GetElementRenderCommands = function(Element)
		{
			let Rect = Element.GetRect();
			let Cmds = Element.Control.GetRenderCommands.call( Element.Control, Rect, Element );
			RenderCommands.pushArray( Cmds );
		}
		this.Elements.forEach( GetElementRenderCommands );
		//	iterate dom and get new commands
		return RenderCommands;
	}
	
}


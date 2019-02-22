var HtmlDomElement = function(Name,Parent)
{
	this.Name = Name;
	this.Control = null;
	this.Children = [];
	this.Parent = Parent;

	this.OverrideRect = null;
	
	//	made this a func in case it because dynamic/auto from HTML dom later
	this.GetRect = function()
	{
		if ( this.OverrideRect )
			return this.OverrideRect;
		if ( !this.Parent )
			throw "No override rect, and no parent. Don't know element size";

		let ThisRect = this.Parent.GetChildRect(this);
		return ThisRect;
	}
	
	this.GetChildRect = function(ChildElement)
	{
		//	get our rect, then calc the childrects
		let ThisRect = this.GetRect();
		let ChildRects = this.Control.GetChildRects( ThisRect, this.Children.length );
		let ChildIndex = this.Children.indexOf( ChildElement );
		return ChildRects[ChildIndex];
	}

}

//	bridge document to a Pop dom interface
Pop.HtmlDom = function(RootElementId)
{
	this.RootElement = null;
	
	this.GetRootRect = function()
	{
		let RootDocumentElement = document.getElementById(RootElementId);
		let Bounds = RootDocumentElement.getBoundingClientRect();
		/*
		let x = 0;
		let y = 0;
		let w = document.documentElement.offsetWidth;
		let h = document.documentElement.offsetHeight;
		*/
		let x = Bounds.left;
		let y = Bounds.top;
		let w = Bounds.width;
		let h = Bounds.height;
		return new Math.Rect( x, y, w, h );
	}
	
	this.CreateElement = function(Name,Parent)
	{
		if ( !Parent )
			Parent = this.RootElement;
		
		let Element = new HtmlDomElement(Name,Parent);
		if ( Parent )
		{
			Parent.Children.push( Element );
		}
		else
		{
			this.RootElement = Element;
			this.RootElement.GetRect = this.GetRootRect;
		}
		
		return Element;
	}
	
	this.GetElement = function(Name)
	{
		//	traverse tree
		let MatchElements = [];
		let CompareElement = function(Element)
		{
			if ( Element.Name == Name )
				MatchElements.push( Element );
			Element.Children.forEach( CompareElement );
		}
		CompareElement( this.RootElement );
		
		if ( MatchElements.length > 1 )
			throw "Multiple elements matching the name " + Name;
		if ( MatchElements.length == 0 )
			throw "No elements name " + Name;
		return MatchElements[0];
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
			
			//	recurse
			Element.Children.forEach( GetElementRenderCommands );
		}
		GetElementRenderCommands( this.RootElement );
	
		//	iterate dom and get new commands
		return RenderCommands;
	}
	
}


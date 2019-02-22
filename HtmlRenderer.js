var THtmlDomCache = function(RootElementId)
{
	this.RootElement = document.getElementById(RootElementId);
	console.log(this.RootElement);
	
	this.GetElement = function(Name)
	{
		let Children = this.RootElement.childNodes;
		let MatchElement = null;
		let FindMatch = function(Child)
		{
			if ( Child.id == Name )
				MatchElement = Child;
		}
		
		Children.forEach( FindMatch );
		
		if ( MatchElement )
			return MatchElement;
		
		//	create new
		Pop.Debug("Creating new element: " + Name );
		MatchElement = document.createElement('div');
		MatchElement.id = Name;
		this.RootElement.appendChild( MatchElement );
		return MatchElement;
	}
}



Pop.HtmlRenderer = function(RootElementId)
{
	this.HtmlDomCache = new THtmlDomCache(RootElementId);

	
	this.ApplyUniform = function(Element,Uniform,Value)
	{
		//	todo: convert numbers to px
		Element.style[Uniform] = Value;
		
		//	this lets CSS access values with attr()
		if ( Uniform == "content" )
		{
			Element.setAttribute( Uniform, Value );
		}
	}
	
	
	this.ApplyRenderCommand = function(Command,Element,CommandIndex)
	{
		//	force sorting order
		Command.Uniforms['zIndex'] = Number(CommandIndex);
		Command.Uniforms['position'] = 'absolute';
		Command.Uniforms['display'] = 'block';
		Command.Uniforms['overflow'] = 'hidden';

		//	Rect = new position
		//	uniforms = style
		Command.Uniforms['left'] = Command.Rect.x + "px";
		Command.Uniforms['top'] = Command.Rect.y + "px";
		Command.Uniforms['width'] = Command.Rect.w + "px";
		Command.Uniforms['height'] = Command.Rect.h + "px";
		
		//	set new class style
		if ( Command.Shader )
			Element.className = Command.Shader;
		
		//	apply all uniforms
		let ApplyUniform = function(Key)
		{
			let Value = Command.Uniforms[Key];
			this.ApplyUniform( Element, Key, Value );
		};
		let UniformKeys = Object.keys( Command.Uniforms );
		UniformKeys.forEach( ApplyUniform.bind(this) );
	}
	
	this.Render = function(RenderCommands)
	{
		let RenderTheCommand = function(RenderCommand,RenderCommandIndex)
		{
			//console.log("New render command:" + JSON.stringify(RenderCommand) );
			let Element = this.HtmlDomCache.GetElement( RenderCommand.ElementName );
			this.ApplyRenderCommand( RenderCommand, Element, RenderCommandIndex );
		}
		RenderCommands.forEach( RenderTheCommand.bind(this) );
	}
	
	this.Loop = function()
	{
		if ( this.OnUpdate )
			this.OnUpdate();
		try
		{
			if ( this.OnUpdate )
				this.OnUpdate();
		}
		catch(e)
		{
			console.log("HtmlRenderer OnUpdate error: " + e);
			throw e;
		}
		
		requestAnimationFrame( this.Loop.bind(this) );
	}
	
	//	start loop
	this.Loop();
}

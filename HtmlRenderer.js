

Pop.HtmlRenderer = function()
{
	this.ApplyUniform = function(Element,Uniform,Value)
	{
		//	todo: convert numbers to px
		Element.style[Uniform] = Value;
	}
	
	this.ApplyRenderCommand = function(Command,Element)
	{
		//	Rect = new position
		//	uniforms = style
		Command.Uniforms['left'] = Command.Rect[0];
		Command.Uniforms['top'] = Command.Rect[1];
		Command.Uniforms['right'] = Command.Rect[0] + Command.Rect[2];
		Command.Uniforms['bottom'] = Command.Rect[1] + Command.Rect[3];
		
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
		let RenderTheCommand = function(RenderCommand)
		{
			let Element = undefined;
			this.ApplyRenderCommand( RenderCommand, Element );
		}
		RenderCommands.forEach( RenderTheCommand.bind(this) );
	}
}

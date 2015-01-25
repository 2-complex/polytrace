
function ToolSelector()
{
    this.selectedTool = this.polygonTool;
    this.tempTool = null;
    this.tools = {};
    this.buttons = {};
}

ToolSelector.prototype.currentTool = function()
{
    return this.tempTool || this.selectedTool;
}

ToolSelector.prototype.init = function()
{
    var toolSelector = this;

    var toolInfo = [
        {name:"polygon", cls:PolygonTool},
        {name:"hand", cls:HandTool},
        {name:"edit", cls:EditTool}
    ];

    for( var i = 0; i < toolInfo.length; i++ )
    {
        var info = toolInfo[i];
        this.tools[info.name] = new info.cls();
        this.buttons[info.name] = $('button.' + info.name);
        this.buttons[info.name].on('mousedown', function()
        {
            toolSelector.selectedTool = toolSelector.tools[$(this).attr("name")];
            return true;
        });
    }

    this.selectedTool = this.tools["polygon"];
}

ToolSelector.prototype.setTempTool = function(name)
{
    this.tempTool = name ? this.tools[name] : null;
}
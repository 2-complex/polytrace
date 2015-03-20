
ToolSet = function(nameTypeMap)
{
    var toolSet = this;
    function makeHandler(name, newTool)
    {
        return function()
        {
            toolSet.selectedTool = newTool;
        };
    }

    for( var name in nameTypeMap )
    {
        var newTool = new nameTypeMap[name]();
        this[name] = newTool;
        $('button.' + name).on( 'mousedown',
            makeHandler(name, newTool) );
    }

    this.selectedTool = this['poly'];
    this.tempTool = null;
};

ToolSet.prototype.currentTool = function()
{
    return this.tempTool || this.selectedTool;
}




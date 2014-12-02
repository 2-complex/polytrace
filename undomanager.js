
function UndoManager()
{
    this.undoList = [];
}

UndoManager.prototype.pop = function()
{
    if ( this.undoList.length > 0 )
    {
        var l = this.undoList.pop();
        l.undoFunction.apply(l.theThis, l.argList);
    }
}

UndoManager.prototype.push = function(undoFunction, theThis, argList)
{
    this.undoList.push({undoFunction:undoFunction, theThis:theThis, argList:argList});
}



function UndoManager()
{
    this.head = -1;
    this.undoList = [];
}

UndoManager.prototype.undo = function()
{
    if( this.head >= 0 )
    {
        var info = this.undoList[this.head];
        info.undoFunction.apply(info.undoThis, info.undoArgList);
        this.head--;
    }
}

UndoManager.prototype.redo = function()
{
    if( this.head < this.undoList.length - 1 )
    {
        this.head++;
        var info = this.undoList[this.head];
        info.redoFunction.apply(info.redoThis, info.redoArgList);
    }
}

UndoManager.prototype.push = function(undoFunction, undoThis, undoArgList, redoFunction, redoThis, redoArgList)
{
    if( this.head < this.undoList.length - 1 )
    {
        this.undoList = this.undoList.slice(0, this.head + 1);
    }
    this.undoList.push({
        undoFunction:undoFunction, undoThis:undoThis, undoArgList:undoArgList,
        redoFunction:redoFunction, redoThis:redoThis, redoArgList:redoArgList});
    this.head++;
}


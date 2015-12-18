
function UndoManager()
{
    this.head = -1;
    this.undoList = [];
    this.drawScreen = function(){};
};

UndoManager.get = function()
{
    UndoManager.instance = UndoManager.instance || new UndoManager();
    return UndoManager.instance;
};

UndoManager.prototype.setDrawScreen = function(drawScreen)
{
    this.drawScreen = drawScreen;
}

UndoManager.prototype.undo = function()
{
    if( this.head >= 0 )
    {
        var info = this.undoList[this.head];
        info.undoFunction.apply(info.undoThis, info.undoArgList);
        this.head--;
    }

    this.drawScreen();
};

UndoManager.prototype.redo = function()
{
    if( this.head < this.undoList.length - 1 )
    {
        this.head++;
        var info = this.undoList[this.head];
        info.redoFunction.apply(info.redoThis, info.redoArgList);
    }

    this.drawScreen();
};

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
};


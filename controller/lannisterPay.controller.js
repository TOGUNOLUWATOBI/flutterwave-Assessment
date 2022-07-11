const lannisterPay = (req,res) => {
    try{
        const splits =req.body.SplitInfo;
        req.accepts('application/json');
        if(splits.length<1 || splits.length>25)
        {
            res.statusCode=401;
            res.statusMessage="invalid parameter";
            return res.json()
        }
        var amount = req.body.Amount;
        var balance=0;
        var total_ratio=0;
        var splitBreakdown=[];
        var flatArray=[];
        var PerArray=[];
        var ratioArray=[];
    

    splits.forEach(elm =>
        {
            if(elm.SplitType=="FLAT")  flatArray.push(elm)
            else if(elm.SplitType =="PERCENTAGE")  PerArray.push(elm)
            else if(elm.SplitType=="RATIO")
            {
                ratioArray.push(elm)
                total_ratio=total_ratio+elm.SplitValue
            }
            else
            {
                res.statusCode=400;
                res.statusMessage = "Split Type not available"
                return res.json()
            }  
        })


    splitter=flatArray.concat(PerArray,ratioArray)

    splitter.forEach(element => {
        
        var split_type = element.SplitType;
        switch(split_type)
        {
            case "FLAT":
                {
                    if(element.SplitValue<0 || amount-element.SplitValue<0)
                    {
                        res.statusCode=400;
                        res.statusMessage="invalid flat value or flat value is too much"
                        return res.json(res.statusMessage+ ": " + element.SplitValue)
                    }
                    amount=amount-element.SplitValue
                    

                    var breakdown ={
                        "SplitEntityId":element.SplitEntityId,
                        "SplitAmount":element.SplitValue
                    }
                    splitBreakdown.push(breakdown)
                    break;

                }

            case "PERCENTAGE":
                {
                    if(element.SplitValue<0)
                    {
                        res.statusCode=400;
                        res.statusMessage="invalid percentage value"
                        return res.json(res.statusMessage+ ": " + element.SplitValue)
                    }
                    var val= element.SplitValue*amount/100
                    amount=amount-val
                    
                    balance=amount
                    var breakdown ={
                        "SplitEntityId":element.SplitEntityId,
                        "SplitAmount":val
                    }
                    splitBreakdown.push(breakdown)
                    break;
                }
            case "RATIO":
                {
                    if(element.SplitValue<0)
                    {
                        res.statusCode=400;
                        res.statusMessage="invalid ratio value"
                        return res.json(res.statusMessage+ ": " + element.SplitValue)
                    }
                    var val=((element.SplitValue/total_ratio)*balance)
                    amount=amount-val
                    
                    var breakdown ={
                        "SplitEntityId":element.SplitEntityId,
                        "SplitAmount":val
                    }
                    splitBreakdown.push(breakdown)
                    break;

                }
            default:
                res.statusCode=400;
                return res.json("split type doesn't exist")
        }
        });
        var response ={
            "ID":req.body.ID,
            "Balance":amount,
            "SplitBreakdown":splitBreakdown
        }
        return res.json(response)
    }
    catch(error)
    {
        const{message}=error;
        return res.json(message)
    }
}


module.exports = {
    lannisterPay
}
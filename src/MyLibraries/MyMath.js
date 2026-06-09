class MyMath{

    //ex: 0.25 will be true while 0.3333333333333 is not
    //////not finished
    static seemsToBeExactNumberWhenFixed(number){
        if(isNaN(number)) return false;

        let decimalStringFixed = MyMath.numberToDecimalString(number);
        let indexOfDecimal = decimalStringFixed.indexOf('.');
        if(indexOfDecimal===-1) return true;
        let decimalPart = decimalStringFixed.slice(indexOfDecimal+1);
        return decimalPart.length<7 && decimalPart.length>indexOfDecimal;///added decimalPart.length>indexOfDecimal 6/4/2026
    }

    //non-scientific notation rounds to as many digits as possible/allowed without uneeded 0's after decimal
    // precision: null means don't round. meaning depends of roundingType
    // roundingType: 'sigFigs' or 'decimal'
    //roundLeftOfDecimal: replaces digits left of decimal with placeholder 0s  /////not tested
    static numberToDecimalString(number,precision=null,groupWithCommas=false,roundingType='sigFigs',roundLeftOfDecimal=true){
        if(number>Number.MAX_VALUE) return '\u221E';//infinity
        if(number<-Number.MAX_VALUE) return '-\u221E';//negative infinity
        if(number===0) return '0';

        let numStr = number.toString();
        if(numStr.indexOf('e')===-1){
            let digitDecStr = numStr[0]==='-'?numStr.slice(1):numStr;//temporarily remove negative
            digitDecStr = MyMath.fixPrecisionError(digitDecStr);
            if(precision!=null){//need to round
                if(roundingType==='decimal'){
                    digitDecStr = MyMath.roundNumberStringToDecimalPlace(digitDecStr,precision,false);
                }else{//'sigFigs'
                    let decimalPosition = digitDecStr.indexOf('.');
                    if(decimalPosition===-1) decimalPosition = digitDecStr.length;
                    let indexOfFirstSigFig = digitDecStr.search(/[1-9]/);
                    let sigFigsLeftOfDecimal = decimalPosition-indexOfFirstSigFig;
                    if(sigFigsLeftOfDecimal>precision && !roundLeftOfDecimal){
                        //round to nearest int (more sigs figs than told to, but rounding would only make number less accurate)
                        digitDecStr = MyMath.roundNumberStringToDecimalPlace(digitDecStr,0,false);
                    }else{
                        digitDecStr = MyMath.roundNumberStringToSigFigs(digitDecStr,precision,false);
                    }
                }
            }
            if(groupWithCommas){
                digitDecStr = MyMath.addCommas(digitDecStr);
            }
            return numStr[0]==='-'?'-' + digitDecStr:digitDecStr;
        }

        if(Math.abs(number)>1){//has e notation because it is big
            return number.toLocaleString('fullwide', { useGrouping: groupWithCommas });//rounds to integer, but number is so big it doesn't matter
        }

        //number has e because it is small
        let firstNonZeroRightOfDecimal = -MyMath.getPowerValue(number);
        let placeToRound = precision==null?16:precision;
        let str = number.toFixed(firstNonZeroRightOfDecimal+placeToRound);////make sure input is less than 100?
        // return str;
        return str.replace(/\.?0+$/,'');//cut off end 0's
    }
    //numstr: number in standard notation
    static fixPrecisionError(numstr){////////////////////not thourouly tested   big numbers like 555554.999999999?  
        if(numstr.indexOf('.')===-1) return numstr;
        let split = numstr.split('.');
        let left = split[0];
        let right = split[1];
        if(right.length<8) return numstr;//5 9's check + 3 cuttoff

        let rightExceptLast3Digits = right.slice(0,right.length-3);
        // if(rightExceptLast3Digits[rightExceptLast3Digits.length-1]==='0'){//if new last diget is a 0, ignore last diget and cut off all 0's   -0.8789062500000000 issue
        if(rightExceptLast3Digits.slice(-5)==='00000'){
            return (left + '.' + rightExceptLast3Digits).replace(/\.?0*$/,'');//cut off end 0's
        }else if(rightExceptLast3Digits.slice(-5)==='99999'){
            let numstrWithoutLast3Digits = left + '.' + rightExceptLast3Digits;
            let isNeg = false;
            if(numstrWithoutLast3Digits[0]==='-'){
                numstrWithoutLast3Digits = numstrWithoutLast3Digits.slice(1);
                isNeg = true;
            }
            let result = MyMath.increaseNumberStringBy1AtIndex(numstrWithoutLast3Digits,numstrWithoutLast3Digits.length-1);
            result = MyMath.removeUseless0s(result);
            if(isNeg){
                return '-' + result;
            }else{
                return result;
            }
        }else{
            return numstr;
        }
    }
    //numstr: only digits or decimal. can lead with 0's. adds an extra 1 on left if needed index should be valid and not be the decimal
    //does not trim extra 0s
    static increaseNumberStringBy1AtIndex(numstr,index){
        let strArray = Array.from(numstr);
        for(let i=index;i>=0;i--){
            if(strArray[i]==='.') continue;
            strArray[i] = MyMath.nextDigit(strArray[i]);
            if(strArray[i]!='0') return strArray.join('');
        }
        //all left of index are 0 now, so add 1 to start

        let result = '1' + strArray.join('');
        return result;
    }
    //numstr: only digits or decimal. can lead with 0's. index should be valid and not be the decimal
    //does not trim extra 0s
    static decreaseNumberStringBy1AtIndex(numstr,index){
        let strArray = Array.from(numstr);
        for(let i=index;i>=0;i--){
            if(strArray[i]==='.') continue;
            strArray[i] = MyMath.prevDigit(strArray[i]);
            if(strArray[i]!='9') return strArray.join('');
        }

        //all left of index are 9 now. repurpose strArray and mimic subtraction algorithm
        for(let i=0;i<strArray.length;i++){
            if(strArray[i]==='.') continue;
            strArray[i] = '0';
        }
        strArray[index] = '1';
        let result = MyMath.subtractStrings(strArray,Array.from(numstr));
        return '-' + result;
    }
    //top should be bigger. no negative signs. does not trim 0s
    static subtractStrings(topNumberArray,bottomNumberArray){
        /////////line up decimal point
        let indexOfTopDecimal = topNumberArray.indexOf('.');
        if(indexOfTopDecimal===-1){
            topNumberArray.push('.');
            indexOfTopDecimal = topNumberArray.length;
        }
        let indexOfBottomDecimal = bottomNumberArray.indexOf('.');
        if(indexOfBottomDecimal===-1){
            bottomNumberArray.push('.');
            indexOfBottomDecimal = bottomNumberArray.length;
        }
        let digitsRightOfDecimalForTop = topNumberArray.length-indexOfTopDecimal-1;
        let digitsRightOfDecimalForBottom = bottomNumberArray.length-indexOfBottomDecimal-1;
        let digitsToAddOnRightOfBottom = digitsRightOfDecimalForTop-digitsRightOfDecimalForBottom;
        while(digitsToAddOnRightOfBottom>0){
            bottomNumberArray.push('0');
            digitsToAddOnRightOfBottom--;
        }
        let digitsToAddOnLeftOfTop = bottomNumberArray.length-topNumberArray.length;
        while(digitsToAddOnLeftOfTop>0){
            bottomNumberArray.unshift('0');
            digitsToAddOnLeftOfTop--;
        }

        //decimal should be at the same index now
        let indexOfDecimal = topNumberArray.indexOf('.');
        //delete decimal for the subtraction algorithm
        topNumberArray.splice(indexOfDecimal,1);
        bottomNumberArray.splice(indexOfDecimal,1);

        let answerArray = [];

        let borrow = function(indexRequesting){
            if(topNumberArray[indexRequesting-1]==='0'){
                borrow(indexRequesting-1);
                topNumberArray[indexRequesting-1] = '9';
            }else{
                topNumberArray[indexRequesting-1] = MyMath.prevDigit(topNumberArray[indexRequesting-1]);
            }
            topNumberArray[indexRequesting] = '1' + topNumberArray[indexRequesting];
        }

        //subtraction
        for(let i=topNumberArray.length-1;i>=0;i--){
            let test = parseInt('0');
            let topNumber = parseInt(topNumberArray[i]);
            let bottomNumber = parseInt(bottomNumberArray[i]);
            if(topNumber<bottomNumber){
                borrow(i);
                topNumber = parseInt(topNumberArray[i]);
            }
            answerArray[i] = (topNumber-bottomNumber).toString();
        }

        //put decimal back
        answerArray.splice(indexOfDecimal,0,'.');

        return answerArray.join('');
    }
    //input: '0','1','3','4','5','6','7','8','9'
    static nextDigit(digit){
        switch(digit){
            case '9': return '0';
            case '0': return '1';
            case '1': return '2';
            case '2': return '3';
            case '3': return '4';
            case '4': return '5';
            case '5': return '6';
            case '6': return '7';
            case '7': return '8';
            case '8': return '9';
        }
    }
    //input: '0','1','3','4','5','6','7','8','9'
    static prevDigit(digit){
        switch(digit){
            case '0': return '9';
            case '1': return '0';
            case '2': return '1';
            case '3': return '2';
            case '4': return '3';
            case '5': return '4';
            case '6': return '5';
            case '7': return '6';
            case '8': return '7';
            case '9': return '8';
        }
    }
    static removeUseless0s(numstr){
        let addNegative = false;
        if(numstr[0]==='-'){
            numstr = numstr.slice(1);
            addNegative = true;
        }
        //now positive

        numstr = numstr.replace(/^0+/,'');//cut off unneeded 0s at the start
        if(numstr === '') return '0';
        if(numstr[0]==='.') numstr = '0' + numstr;

        if(numstr.indexOf('.')!=-1){
            numstr = numstr.replace(/\.?0*$/,'');//cut off end 0's and decimal if needed;
        }

        if(addNegative) numstr = '-' + numstr;

        return numstr;
    }
    //from stackOverflow   https://stackoverflow.com/questions/3753483/javascript-thousand-separator-string-format
    static addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    static numberToScientificNotationString(number,precision=null,keepUneeded0sAfterDecimal=false){
        if(number>Number.MAX_VALUE) return '\u221E';
        if(number<-Number.MAX_VALUE) return '-\u221E';

        let ob = MyMath.getScientificNotationObject(number);
        let coefficientString = MyMath.fixPrecisionError(ob.coeff.toString());
        if(precision!=null){
            let coefficientDigitDec = coefficientString[0]==='-'?coefficientString.slice(1):coefficientString;//take away negative temporariliy
            coefficientDigitDec = MyMath.roundNumberStringToSigFigs(coefficientDigitDec,precision,keepUneeded0sAfterDecimal);
            if(coefficientDigitDec==='10'){
                coefficientDigitDec = '1';
                ob.exp++;
            }
            coefficientString = coefficientString[0]==='-'?'-' + coefficientDigitDec:coefficientDigitDec;
        }
        return coefficientString + '*10^' + ob.exp;
    }

    //cutoffs: positive only
    static numberToPossiblyScientificNotation(number,commas=false,precision=null,keepUneeded0sAfterDecimal=false,lowCutoff=0.001,highCutoff=1000000000,roundingType='sigFigs'){////commas?
        if(number===0) return '0';
        
        if(Math.abs(number)<lowCutoff || Math.abs(number)>=highCutoff){
            return MyMath.numberToScientificNotationString(number,precision,keepUneeded0sAfterDecimal);//only sig figs for sci notation
        }else{
            return MyMath.numberToDecimalString(number,precision,commas,roundingType);
        }
    }
    
    //returns {coeff:#,exp:#}
    static getScientificNotationObject(number){
        let exponent = MyMath.getPowerValue(number);
        let coefficient = number/Math.pow(10,exponent);
        return {coeff:coefficient,exp:exponent};
    }

    
    static radianToLinearDisplay(radian,trigMode,roundingType='sigFigs'){
        return trigMode==='radian'?MyMath.radianToDisplayRadian(radian,roundingType):MyMath.numberToDecimalString(radian*180/Math.PI,null,true,roundingType)+'\u00B0';
    }

    //radian: number   tries to display as a small fraction of pi
    static radianToDisplayRadian(radian,roundingType='sigFigs',precision=null,keepUneeded0sAfterDecimal=false){
        let radinWithoutPi = radian/Math.PI;
        let fracOfRadianWithoutPi = MathJSHelper.numberToFraction(radinWithoutPi);////////don't rely on math.js?
        let n = fracOfRadianWithoutPi.n*fracOfRadianWithoutPi.s;
        let d = fracOfRadianWithoutPi.d;


        if(n===1&&d===1) return '\u03C0';
        if(d===1) return MyMath.numberToDecimalString(n,precision,true,roundingType) + '\u03C0';
        if(n<100&&d<100) return MyMath.numberToDecimalString(n,precision,true,roundingType) + '/' + MyMath.numberToDecimalString(d,precision,true) + ' \u03C0';
        
        return MyMath.numberToPossiblyScientificNotation(radian,true,precision,keepUneeded0sAfterDecimal,0.0001,1000000000000,roundingType);///use options for sig figs cutoff
    }


    //if multiple is negative, it rounds up////////same in javascript?
    ///precision error with 4.1,0.1
    static roundDownToNearestMultipleOf(number,multiple){
        var ans = number/multiple;
        ans = Math.floor(ans);
        ans *= multiple;
        return ans;
    }
    //if multiple is negative, it rounds down////////same in javascript?
    static roundUpToNearestMultipleOf(number,multiple){
        var ans = number/multiple;
        ans = Math.ceil(ans);
        ans *= multiple;
        return ans;
    }

    static roundToNearestMultipleOf(number,multiple){
        return MyMath.roundDownToNearestMultipleOf(number+multiple/2,multiple);
    }

    static nextMultipleOf(number,multiple){
        let result = MyMath.roundDownToNearestMultipleOf(number+multiple,multiple);
        if(Math.abs(number-result)<multiple/10000) result+=multiple;////rush attempt at patching precision error
        return result;
    }
    static previousMultipleOf(number,multiple){
        let result = MyMath.roundUpToNearestMultipleOf(number-multiple,multiple);
        if(Math.abs(number-result)<multiple/10000) result-=multiple;////rush attempt at patching precision error
        return result;
    }

    //returns angle from start to end point (-Pi<value<=Pi)
    static findAngleFromTo(xStart,yStart,xEnd,yEnd){
        return Math.atan2(yEnd-yStart,xEnd-xStart);
    }
    //returns angle from (0,0) to the given coordinates (-Pi<value<=Pi)
    static findAngleTo(xEnd,yEnd){
        return Math.atan2(yEnd,xEnd);
    }
    //returns angle from start to end point (0<value<=2Pi)
    static findAngleFromTo02PI(xStart,yStart,xEnd,yEnd){
        let angle = MyMath.findAngleFromTo(xStart,yStart,xEnd,yEnd);
        if(angle<0){
            return angle+Math.PI*2;
        }else{
            return angle;
        }
    }
    //returns angle from (0,0) to the given coordinates (0<value<=2Pi)
    static findAngleTo02PI(xEnd,yEnd){
        let angle = MyMath.findAngleTo(xEnd,yEnd);
        if(angle<0){
            return angle+Math.PI*2;
        }else{
            return angle;
        }
    }

    //returns an equivilant angle (-Pi<value<=Pi)
    static standardizeAngle(angle){
        if(angle<=Math.PI && angle>-Math.PI){
            return angle;
        }else if(angle>Math.PI){
            let changedAngle = angle + Math.PI;
            return -Math.PI+(changedAngle-MyMath.roundDownToNearestMultipleOf(changedAngle,Math.PI*2));
        }else{//angle <=-pi/2
            return -MyMath.standardizeAngle(-angle);
        }
    }

    //text: string of a positive or negative decimal number
    //return: 0 means ones place, 1 means 10's place, -1 means tenths place...
    //if the index refers to the decimal or negative sign, just returns null
    static getPowerValueOfIndex(text,index){
        if(!MyMath.isDigit(text[index])){
            return null;
        }
        //find the decimal. assume only one
        let decIndex = text.indexOf('.');
        if(decIndex==-1){
            decIndex = text.length;//no decimal: must be invisible at end
        }
        

        if(decIndex>index){
            return decIndex-index-1;
        }else{
            return -(index-decIndex);
        }
    }

    static isDigit(char){
        return char>='0'&&char<='9';
    }

    static _isPartOfNumber(char){
        return MyMath.isDigit(char) || char=='.';
    }

    static getDecimalRegex(){//basic number. can have decimals or be negative
        return new RegExp(/-?((\d+\.?\d*)|(\.\d+))/,'g');
    }
    static getPositiveDecimalRegex(){
        return new RegExp(/((\d+\.?\d*)|(\.\d+))/,'g');
    }
    //number in scientific notation at the end using e. can be negative
    //base can be any decimal number, exponent must be a integer
    static getSciNotationRegex(){
        return new RegExp(/-?((\d+\.?\d*)|(\.\d+))(e[+-]\d+)/,'g');
    }
    static getPositiveSciNotationRegex(){
        return new RegExp(/((\d+\.?\d*)|(\.\d+))(e[+-]\d+)/,'g');
    }

    //number that can possibly have scientific notation at the end using e. can be negative
    //base can be any decimal number, exponent must be a integer
    static getNumberRegex(){
        return new RegExp(/-?((\d+\.?\d*)|(\.\d+))(e[+-]\d+)?/,'g');////////////////any exponent:  -?((\d+\.?\d*)|(\.\d+))(e[+-]((\d+\.?\d*)|(\.\d+)))?/
    }
    static getPositiveNumberRegex(){
        return new RegExp(/((\d+\.?\d*)|(\.\d+))(e[+-]\d+)?/,'g');
    }

    // numstr: digits and possibly one decimal
    static roundNumberStringToSigFigs(numstr,sigFigs,keepUneeded0sAfterDecimal=false){
        let indexOfFirstSigFig = numstr.search(/[1-9]/);
        if(indexOfFirstSigFig===-1) return '0';

        let placesToMove = sigFigs-1;
        let indexOfLastSigFig = indexOfFirstSigFig + placesToMove;
        let decimalPosition = numstr.indexOf('.');
        if(decimalPosition>indexOfFirstSigFig && decimalPosition<=indexOfLastSigFig){
            indexOfLastSigFig++;
        }
        ///////add decimal for 100. with 3 sig figs?
        return MyMath.roundNumberStringToCharPosition(numstr,indexOfLastSigFig,keepUneeded0sAfterDecimal=false);
    }
    // numstr: digits and possibly one decimal
    // decimalPlace: example for "123.456":  0: 123   1: 123.4   -1: 120
    // cuts off uneeded 0s after the decimal on the right
    static roundNumberStringToDecimalPlace(numstr,decimalPlace,keepUneeded0sAfterDecimal=false){
        let decimalIndex = numstr.indexOf('.');
        if(decimalIndex===-1) decimalIndex = numstr.length;

        let charIndex = decimalPlace>0?decimalIndex+decimalPlace:decimalIndex+decimalPlace-1;
        return MyMath.roundNumberStringToCharPosition(numstr,charIndex,keepUneeded0sAfterDecimal);
    }
    // numstr: digits and possibly one decimal
    //charIndex can be out of bounds
    static roundNumberStringToCharPosition(numberText,charIndex,keepUneeded0sAfterDecimal=false){
        let decimalPosition = numberText.indexOf('.');
        if(decimalPosition===-1) decimalPosition = numberText.length;
        let noDecimalString = numberText.slice(0,decimalPosition) + numberText.slice(decimalPosition+1);
        
        let charIndexInNoDecString = charIndex<decimalPosition?charIndex:charIndex-1;

        let info = MyMath._incrementIfNeededForRoundingAtCharPosition(noDecimalString,charIndexInNoDecString);
        let uncutRoundedString = info.str;
        let charIndexInUncutRoundedString = charIndexInNoDecString;
        let onesPlaceIndex = decimalPosition-1;
        if(info.addedExtraDigit){
            charIndexInUncutRoundedString++;
            onesPlaceIndex++;
            decimalPosition++;
        }

        let roundedNoDecimalString = MyMath._cutOffAndAddBuffer0sIfNeeded(uncutRoundedString,charIndexInUncutRoundedString,onesPlaceIndex,keepUneeded0sAfterDecimal);

        //putDecimalBack
        if(decimalPosition>=roundedNoDecimalString.length){
            return roundedNoDecimalString;
        }else{
            if(roundedNoDecimalString==='0' && charIndexInUncutRoundedString<0){//edge case for .01990
                return roundedNoDecimalString;
            }

            return roundedNoDecimalString.slice(0,decimalPosition) + '.' + roundedNoDecimalString.slice(decimalPosition);
        }
        
    }
    //ex: digitString: '956' charIndex: 1   returns {str:'966',addedExtraDigit:false}
    //ex: digitString: '956' charIndex: 0   returns {str:'1056',addedExtraDigit:true}
    static _incrementIfNeededForRoundingAtCharPosition(digitString,charIndex){
        if(charIndex===-1){
            let info = MyMath._incrementIfNeededForRoundingAtCharPosition('0' + digitString,charIndex+1);
            if(info.str[0]==='0'){//same 0 that was added
                return {str:info.str.slice(1),addedExtraDigit:false};
            }else{
                return {str:info.str,addedExtraDigit:true};
            }
        }else if(charIndex<-1){
            return {str:'0',addedExtraDigit:false};
        }else if(charIndex>=digitString.length-1){
            return {str:digitString,addedExtraDigit:false};
        }

        //normal case:
        let toReturn = digitString;
        let roundUp = (charIndex<digitString.length-1 && Number(digitString[charIndex+1])>=5);
        if(roundUp){
            toReturn = MyMath.increaseNumberStringBy1AtIndex(digitString,charIndex);
        }
        let addedExtraDigit = toReturn.length>digitString.length;
        if(addedExtraDigit){
            charIndex++;
        }
        return {str:toReturn,addedExtraDigit:addedExtraDigit};
    }
    //cuts off uneeded 0s after the decimal on the right    100 to 100.00
    static _cutOffAndAddBuffer0sIfNeeded(uncutRoundedDigitString,indexRoundedAt,onesPlaceIndex,keepUneeded0sAfterDecimal){
        let toReturn = uncutRoundedDigitString.slice(0,indexRoundedAt+1);//cut off unsignificant digits
        if(keepUneeded0sAfterDecimal){
            if(toReturn==='0' || toReturn==='') return '0';//////duplicate code
            if(toReturn.length-1<indexRoundedAt || toReturn.length-1<onesPlaceIndex){
                toReturn += '0'.repeat(Math.max(indexRoundedAt-(toReturn.length-1),onesPlaceIndex-(toReturn.length-1)));//add extra 0s
            }
            return toReturn;
        }
        
        if(toReturn==='0' || toReturn==='') return '0';
        if(indexRoundedAt<onesPlaceIndex){
            toReturn += '0'.repeat(onesPlaceIndex-indexRoundedAt);//add placeholder 0s
        }else if(indexRoundedAt>onesPlaceIndex){
            //get rid of 0s after the end after the decimal like 53.05000 to 53.05
            let startIndexOf0sAtEnd = toReturn.search(/0+$/);//search for at least 1 0 at the end of the string
            if(startIndexOf0sAtEnd!=-1){
                //make sure not to cut off 0s at or left of onesPlace. Ex: rounding to tenths in 9699.99 -> 97000 should just give 9700, not 97
                if(startIndexOf0sAtEnd<=onesPlaceIndex) startIndexOf0sAtEnd = onesPlaceIndex+1;

                toReturn = toReturn.slice(0,startIndexOf0sAtEnd);
            }
        }
        return toReturn;
    }




    static isInteger(number){
        return Math.floor(number)===number;
    }
    static isPositiveInteger(number){
        return Math.floor(number)===number && number>0;
    }

    static getPowerValue(number){
        return Math.floor(Math.log10(Math.abs(number)));
    }

    static roundToPowerValue(number,powerValue){
        if(number===0) return 0;
        let tenPow = Math.pow(10,powerValue);
        return Math.round(number/tenPow)*tenPow;
    }

    static roundToSigFigs(number,sigFigs){
        if(number===0) return 0;
        let powerValue = MyMath.getPowerValue(number);
        return MyMath.roundToPowerValue(number,powerValue-(sigFigs-1));
    }

    

    //returns sorted list of #'s or null. same restrictions as prime factorization but can return [1] for 1
    static allFactors(number){
        if(number===1) return [1];
        let primeFactorization = MyMath.primeFactorization(number);//[{base:2,exponent:2},{base:3,exponent:1},{base:5,exponent:2},{base:7,exponent:1}]
        if(primeFactorization==null) return null;


        //example: number is 2100. prime factorization is 2^2*3*5^2*7
        //combine all options of number of each prime to choose (and 1 as well)
        // (2,4)(3)(5,25)(7)
        //start with (2,4) and bring in possibilities from the right
        // (2,4,6,12)(5,25)(7)
        // (2,4,6,12,10,20,30,60,50,100,150,300)(7)
        // (2,4,6,12,10,20,30,60,50,100,150,300)(7)
        // (2,4,6,12,10,20,30,60,50,100,150,300,14,28,42,84,70,140,210,420,350,700,1050,2100)
        //add 1 (1,2,4,6,12,10,20,30,60,50,100,150,300,14,28,42,84,70,140,210,420,350,700,1050,2100)

        let factorChoiceArray = [];
        primeFactorization.forEach(function(primeBaseEx){
            let allChoicesForThatPrime = [];
            for(let i=1;i<=primeBaseEx.exponent;i++){
                allChoicesForThatPrime.push(Math.pow(primeBaseEx.base,i));
            }
            factorChoiceArray.push(allChoicesForThatPrime);
        });
        //factorChoiceArray now [ [2,4],[3],[5,25],[7] ]

        let allFactorArray = factorChoiceArray[0];
        for(let i=1;i<factorChoiceArray.length;i++){
            let factorChoice = factorChoiceArray[i];//[5,25] at second loop
            let originalAllFactorArrayLength = allFactorArray.length;
            for(let k=0;k<factorChoice.length;k++){
                allFactorArray.push(factorChoice[k]);
                for(let j=0;j<originalAllFactorArrayLength;j++){
                    allFactorArray.push(allFactorArray[j]*factorChoice[k]);
                }
            }
        }

        allFactorArray.push(1);

        allFactorArray.sort(function(a, b) {
            return a - b;
        });

        return allFactorArray;
    }

    //returns array of {base:#,exponent:#}  or null
    static primeFactorization(number){
        if(Math.floor(number)!=number || number<2 || number>Number.MAX_SAFE_INTEGER) return null;//Number.MAX_SAFE_INTEGER: 2^53 - 1

        let factorArray = [];

        if(number%2===0){
            let howManyToFactor = 0;
            while(number%2===0){
                number/=2;
                howManyToFactor++;
            }
            factorArray.push({base:2,exponent:howManyToFactor});
        }

        let sqrt = Math.sqrt(number);
        for(let i=3;i<=sqrt;i++){
            if(number%i===0){
                let howManyToFactor = 0;
                while(number%i===0){
                    number/=i;
                    howManyToFactor++;
                }
                factorArray.push({base:i,exponent:howManyToFactor});
                sqrt = Math.sqrt(number);
            }
        }

        if(number!=1){
            factorArray.push({base:number,exponent:1});
        }
        return factorArray;
    }
    //primeFactorization: array of {base:#,exponent:#}
    static primeFactorizationToString(primeFactorization,showPowersOf1=false){
        let text = '';

        let addEntry = function(likeFactors){
            if(!showPowersOf1&&likeFactors.exponent===1){
                text+= likeFactors.base.toString();
            }else{
                text+= likeFactors.base.toString()+'^'+likeFactors.exponent.toString();
            }
        }

        addEntry(primeFactorization[0]);
        for(let i=1;i<primeFactorization.length;i++){
            text+='*';
            addEntry(primeFactorization[i]);
        }
        return text;
    }

    //radicand: integer
    //root: integer>=2
    //returns: {outside:int, inside:int, iOutside:bool}
    static simplifyRoot(radicand,root){
        if(radicand===0) return {outside:0, inside:1, iOutside:false};
        if(radicand===1) return {outside:1, inside:1, iOutside:false};
        if(radicand===-1) return root%2===0?{outside:1, inside:1, iOutside:true}:{outside:-1, inside:1, iOutside:false};
        //abs(radicand) now >=2 as well

        let outside = 1;
        let inside = radicand;
        let iOutside = false;
        if(inside<0){
            inside*=-1;
            if(root%2===0){//even root
                iOutside = true;
            }else{//odd root
                outside*=-1;
            }
        }
        
        let primeFactorization = MyMath.primeFactorization(inside);
        for(let baseExponent of primeFactorization){
            let base = baseExponent.base;
            let exponent = baseExponent.exponent;
            while(exponent>=root){
                outside*=base;
                inside/=Math.pow(base,root);
                exponent-=root;
            }
        }
        return {outside:outside, inside:inside, iOutside:iOutside};
    }



    //assumes all rows are the same length
    static ref(twoDNumberArray){
        let offset = 0// for redundant rows
        for(let i=0;i + offset < twoDNumberArray[0].length && i < twoDNumberArray.length;i++){
            //swap rows to make sure the leading term is not 0
            if(twoDNumberArray[i][i + offset] == 0){
                for (let j =i+1;j < twoDNumberArray.length; j++){
                    if(twoDNumberArray[j][i + offset] != 0){
                        MyMath.switchRows(twoDNumberArray,i,j);
                        break;
                    }
                }
            }
            //if the whole bottom of the column is 0, there is a redundant row. Move 1 to the right
            if(twoDNumberArray[i][i + offset] == 0){
                offset ++;
                i --;
                continue;
            }

            //make leading number 1
            let temp = twoDNumberArray[i][i + offset];
            for(let j=i + offset;j < twoDNumberArray[0].length;j++){
                twoDNumberArray[i][j] /= temp;
            }

            //add multiples of that row to the lower rows
            for(let j = i+1;j < twoDNumberArray.length; j++){
                let temp2 = twoDNumberArray[j][i + offset];
                for (let k = i + offset;k < twoDNumberArray[0].length;k++){
                    twoDNumberArray[j][k] -= temp2 * twoDNumberArray[i][k];
                }
            }
        }
    }

    static rref(twoDNumberArray){
        MyMath.ref(twoDNumberArray);
        
        for(let j = twoDNumberArray.length - 1; j > 0; j--){
            //find leftmost non-zero number
            let firstNon0Col = -1;
            for(let i = 0; i < twoDNumberArray[0].length; i++){
                if (twoDNumberArray[j][i] != 0){
                    firstNon0Col = i;
                    break;
                }
            }

            //if firstNon0Col is -1, the whole row is zero. skip to next
            if(firstNon0Col == -1){
                continue;
            }

            //add multiples of that row to the higher rows
            for(let k = j-1; k >= 0; k--){
                let multiple = twoDNumberArray[k][firstNon0Col];
                for(let i = firstNon0Col; i < twoDNumberArray[0].length; i++){
                    twoDNumberArray[k][i] -= multiple * twoDNumberArray[j][i]
                }
            }
        }
        

    }

    static switchRows(numMatrix,row1,row2){
        let temp = numMatrix[row1];
        numMatrix[row1] = numMatrix[row2];
        numMatrix[row2] = temp;
    }



    

    //input: {power#:#,power#:#...}
    //returns [{pow:#,coeff:#},...] list of objects sorted by power. Hightest power first. Ignores terms with a 0 coeff
    static polyCoeffsToSortedListByPower(coeffs){
        let list = [];
        for(let pow in coeffs){
            let powNum = Number(pow);
            let coeff = coeffs[pow];
            if(coeff===0) continue;
            list.push({pow:powNum,coeff:coeff});
        }
        list.sort(function(a,b){return b.pow-a.pow});
        return list;
    }

    // polyTermInfo: [{pow:#,coeff:#},...] list of objects sorted by power. Hightest power first
    //returns {quotient:polyTermInfo,remainder:polyTermInfo} (still sorted)
    //inputs and outputs must have at least one term. If remainder is 0, it will be [{pow:0,coeff:0}]
    static polynomialDivision(numInfo,denomInfo){
        // return {quotient:[{pow:2,coeff:1},{pow:1,coeff:2},{pow:0,coeff:3}],remainder:[{pow:1,coeff:4},{pow:0,coeff:5}]};

        let quotientInfo = [];
        while(numInfo[0].pow>=denomInfo[0].pow){
            let newTermForQuotient = {pow:numInfo[0].pow-denomInfo[0].pow,coeff:numInfo[0].coeff/denomInfo[0].coeff};
            quotientInfo.push(newTermForQuotient);

            let multInfo = [];
            for(let i=1;i<denomInfo.length;i++){
                let denomTerm = denomInfo[i];
                multInfo.push({pow:newTermForQuotient.pow+denomTerm.pow,coeff:newTermForQuotient.coeff*denomTerm.coeff*-1});//*-1 here to add when merging instead of subtracting
            }

            //add and merge
            let newNumInfo = [];
            let n=1,m=0;
            while(n<numInfo.length && m<multInfo.length){
                let numTerm = numInfo[n];
                let multTerm = multInfo[m];
                if(numTerm.pow>multTerm.pow){
                    newNumInfo.push(numTerm);
                    n++;
                }else if(numTerm.pow<multTerm.pow){
                    newNumInfo.push(multTerm);
                    m++;
                }else{//numTerm.pow===multTerm.pow
                    let newCoeff = numTerm.coeff+multTerm.coeff;
                    if(newCoeff!==0){
                        newNumInfo.push({pow:numTerm.pow,coeff:newCoeff});
                    }
                    n++;
                    m++;
                }
            }
            //push the rest in the remaining list
            let infoWithStuffToAdd;
            let i;
            if(n<numInfo.length){
                infoWithStuffToAdd = numInfo;
                i=n;
            }else if(m<multInfo.length){
                infoWithStuffToAdd = multInfo;
                i=m;
            }
            if(infoWithStuffToAdd!=null){
                for(;i<infoWithStuffToAdd.length;i++){
                    newNumInfo.push(infoWithStuffToAdd[i]);
                }
            }

            numInfo = newNumInfo;
            if(numInfo.length===0) return {quotient:quotientInfo,remainder:{pow:0,coeff:0}};
        }

        return {quotient:quotientInfo,remainder:numInfo};
    }

    //returns list of polyInfo   [[{pow:#,coeff:#},...],  [{pow:#,coeff:#},...]]  hopefully most of them are linear terms
    static factorRationalRoots(sortedPolyInfo){
        // return [[{pow:1,coeff:1},{pow:0,coeff:1}],  [{pow:1,coeff:1},{pow:0,coeff:1}]];

        let mainPolyInfo = sortedPolyInfo;
        let allFactorsOfConstant = MyMath.allFactors(Math.abs(mainPolyInfo[mainPolyInfo.length-1].coeff));
        let allFactorsOfLeadingCoeff = MyMath.allFactors(Math.abs(mainPolyInfo[0].coeff));
        let factorPolyList = [];

        let possibleRationalRootsSet = new Set();
        for(let i=0;i<allFactorsOfLeadingCoeff.length;i++){
            for(let j=0;j<allFactorsOfConstant.length;j++){
                let ratio = allFactorsOfConstant[j]/allFactorsOfLeadingCoeff[i];
                possibleRationalRootsSet.add(ratio);
                possibleRationalRootsSet.add(-ratio);
            }
        }

        let doWithPossibleRootFunction = function(possibleRationalRoot){
            while(mainPolyInfo[0].pow>=2 && MyMath.evalPolyInfo(mainPolyInfo,possibleRationalRoot)===0){
                let factorPolyInfo = [{pow:1,coeff:1},{pow:0,coeff:-possibleRationalRoot}];
                let divideInfo = MyMath.polynomialDivision(mainPolyInfo,factorPolyInfo);
                mainPolyInfo = divideInfo.quotient;
                factorPolyList.push(factorPolyInfo);
            }
        };
        doWithPossibleRootFunction(0);//try 0 to factor out xs
        possibleRationalRootsSet.forEach(doWithPossibleRootFunction);//try to factor out the other rational roots
        factorPolyList.push(mainPolyInfo);
        return factorPolyList;
    }
    static evalPolyInfo(polyInfo,x){
        let answer = 0;
        for(let i=0;i<polyInfo.length;i++){
            let term = polyInfo[i];
            answer += term.coeff*Math.pow(x,term.pow);
        }
        return answer;
    }




    //evaluator: has evaluate(scope) method
    //scope example: ['a':3,'b':2]
    static limitFromLeft(evaluator,approachingNumber,scope,limitVar){
        return MyMath.limitApproachingNumberFrom(evaluator,approachingNumber,scope,limitVar,approachingNumber-0.001);
    }
    static limitFromRight(evaluator,approachingNumber,scope,limitVar){
        return MyMath.limitApproachingNumberFrom(evaluator,approachingNumber,scope,limitVar,approachingNumber+0.001);
    }
    static limitPositiveInfinity(evaluator,approachingNumber,scope,limitVar){
        let limitWhenStartBig = MyMath.limitApproachingNumberFrom(evaluator,approachingNumber,scope,limitVar,1e50);
        if(!Number.isNaN(limitWhenStartBig)) return limitWhenStartBig;

        return MyMath.limitApproachingNumberFrom(evaluator,approachingNumber,scope,limitVar,10);
    }
    static limitNegativeInfinity(evaluator,approachingNumber,scope,limitVar){
        let limitWhenStartBig = MyMath.limitApproachingNumberFrom(evaluator,approachingNumber,scope,limitVar,-1e50);
        if(!Number.isNaN(limitWhenStartBig)) return limitWhenStartBig;

        return MyMath.limitApproachingNumberFrom(evaluator,approachingNumber,scope,limitVar,-10);
    }
    static limitApproachingNumberFrom(evaluator,approachingNumber,scope,limitVar, startingNumber){
        const closeEnough = 1e-12;
        const maxAttempts = 320;

        let changeCurrentNumberFunction;
        if(Number.isFinite(approachingNumber)){
            changeCurrentNumberFunction = MyMath._changeCurrentNumberFunctionFinite;
        }else if(approachingNumber === Number.POSITIVE_INFINITY || approachingNumber === Number.NEGATIVE_INFINITY){
            changeCurrentNumberFunction = MyMath._changeCurrentNumberFunctionInfinite;
        }else{
            return Number.NaN;
        }

        let oldNumber;
        let oldEval;
        let oldEvalDifference;

        let currentNumber = startingNumber;
        scope[limitVar] = currentNumber;
        let newEval = evaluator.evaluate(scope);
        let currentEvalDifference;
        // console.log('x:' + currentNumber + ' y:' + newEval);


        let attempts = 0;
        do{
            oldNumber = currentNumber;
            oldEval = newEval;
            oldEvalDifference = currentEvalDifference;

            currentNumber = changeCurrentNumberFunction(approachingNumber,currentNumber);
            scope[limitVar] = currentNumber;
            newEval = evaluator.evaluate(scope);

            currentEvalDifference = newEval-oldEval;

            // console.log('x:' + currentNumber + ' y:' + newEval + ' currentEvalDifference:' + currentEvalDifference);

            if(currentEvalDifference*oldEvalDifference<0){
                if(Math.abs(currentEvalDifference)<0.5) return oldEval;//if it changed directions, then stop before it gets unstable like with \lim_{x}^{3}\frac{-27\left(x^{2}+x-12\right)}{x^{3}-27}
                return Number.NaN;//\lim_{x}^{\infty}\frac{x^{2}\sin\left(3x\right)}{2x} does not converge. Difference too big
            }
            if(!Number.isFinite(newEval)){
                if(newEval===Number.POSITIVE_INFINITY || newEval===Number.NEGATIVE_INFINITY) return newEval;
                
                return MyMath._changeToZeroOrInfIfClose(oldEval);//newEval was probably invalid
            }

            attempts++;
        }while(Math.abs(currentEvalDifference)>closeEnough && attempts<maxAttempts);
        
        // if(Math.abs(newEval)<1e-16) return 0;// make limits like \lim_{x}^{\infty}\frac{x\left(x+1\right)\left(x+2\right)}{x\left(x+2\right)\left(x+1\right)\left(x+1\right)}  return a clean 0 instead of scientific notation

        if(Math.abs(currentEvalDifference)<=closeEnough){
            return MyMath._changeToZeroOrInfIfClose(newEval);
        }
        return Number.NaN;
    }
        static _changeToZeroOrInfIfClose(number){
            let abs = Math.abs(number);
            if(abs<1e-16) return 0;
            if(number>=1e50) return Number.POSITIVE_INFINITY;
            if(number<=-1e50) return Number.NEGATIVE_INFINITY;
            return number;
        }
        static _changeCurrentNumberFunctionFinite(approachingNumber,currentNumber){
            return approachingNumber-(approachingNumber-currentNumber)/10;
        }
        static _changeCurrentNumberFunctionInfinite(approachingNumber,currentNumber){
            let abs = Math.abs(currentNumber);
            if(currentNumber<100) return currentNumber*2;
            if(currentNumber<10000) return currentNumber*10;
            if(currentNumber<1e30) return currentNumber*100;
            return currentNumber*1000;
        }


    //ratio: percent of way between start and end. (0 would return numStart and 1 will return numEnd)
    static interpolate(numStart,numEnd,ratio){
        let diff = numEnd-numStart;
        return numStart+diff*ratio;
    }

}


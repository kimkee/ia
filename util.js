var number = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
var unit = ["", "만", "억", "조"];
var smallUnit = ["천", "백", "십", ""];

// 공통 UTIL
var util = {
	// 현재 날짜 구하기
	currentDate : function() {
		var date = new Date();
		var year = date.getFullYear();
		var month = (date.getMonth() + 1) > 9 ? "" + (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
		var day = date.getDate() > 9 ? "" + date.getDate() : "0" + date.getDate();

		return year + month + day;
	},
	// 현재 시간 구하기
	currentTime : function() {
		var date = new Date();
		var hours = date.getHours() > 9 ? "" + date.getHours() : "0" + date.getHours();
		var minutes = date.getMinutes() > 9 ? "" + date.getMinutes() : "0" + date.getMinutes();
		var seconds = date.getSeconds() > 9 ? "" + date.getSeconds() : "0" + date.getSeconds();

		return hours + minutes + seconds;
	},
	// as-is 임시 function
/*******************************************************************************
 * 1) function 명 : fnc_isDigit( digit ) 2) function 설명 : Argument 가 숫자인지 여부를 확인
 * 3) parameter 설명 : digit : 숫자로 이루어진 문자열 4) return 값 : true / false 5) 변경 이력 :
 * 2012.06.15 - 최초작성 ( lsh )
 ******************************************************************************/
	isDigit : function (digit) {
		// var reg = /^d+$/;
		// return reg.test( digit.val() );
		var result = new RegExp("^[0-9]+$", "g").test(digit);
		// alert( result );
		return result;
		// return !isNaN( parseInt( digit )) && isFinite(digit );
	},
	// as-is 임시 function
	clearDateFormat : function(value) {
		var result = null;

		if (value == "undefined" || value==undefined) {
			// 입력값 없음...
			return "";
		}

		if (value.length == 8) {
			// var oNum = /[.\-\/]/g;
			// var SEP = value.substr(2,1);
			// if (oNum.test(SEP)){
			// var YY = value.substr(0,2);
			// var MM = value.substr(3,2);
			// var DD = value.substr(6,2);
			// result = YY+MM+DD;
			// }else{
			result = value;
			// }
		} else if (value.length == 10) {
			var SEP = value.substr(4, 1);
			// alert (SEP);
			var YYYY = value.substr(0, 4);
			var MM = value.substr(5, 2);
			var DD = value.substr(8, 2);
			result = YYYY + MM + DD;

		} else if (value.length == 7) {
			var SEP = value.substr(4, 1);
			var YYYY = value.substr(0, 4);
			var MM = value.substr(5, 2);
			result = YYYY + MM;
		} else if (value.length == 6) {
			result = value;
		}

		else {
			// 형식 오류
			// alert("올바른 날짜 형식이 아닙니다.");
			result = "";
		}

		return result;
		// return clearPeriod( clearDash( clearSlash( value ) ) );
	},
	 // as-is 임시 function
/*****************************************************************************
 * 1) function 명 : fnc_addDate( date, day ) 2) function 설명 : 일자에 특정 일수를 연산
 * (더하기,빼기) 3) parameter 설명 : date : YYYYMMDD, YYYY/MM/DD, YYYY.MM.DD,
 * YYYY-MM-DD 형태의 날짜 데이터 num : 연산할 수 ( 정수 형태 ) type : 연산할 유형 ( D : 일수 더하기, M :
 * 개월수 더하기, W : 주 더하기, Y : 연도 더하기 ) 4) return 값 : 날짜 계산된 YYYYMMDD 형태의 문자열 5) 변경
 * 이력 : 2012.06.15 - 최초작성 ( lsh )
 ******************************************************************************/
	addDate : function(date, num, type) {
		var sDate = util.clearDateFormat(date);

		// type D/M/W
		if (sDate.length != 8)
			return date;
		if (util.isDigit(sDate) == false)
			return date;

		var yyyy = sDate.substr(0, 4);
		var mm = eval(sDate.substr(4, 2));
		var dd = sDate.substr(6, 2);

		var stdDate = new Date();
		stdDate.setFullYear(yyyy);
		stdDate.setDate(dd);
		stdDate.setMonth(mm - 1);

		if (type == 'D' || type == 'd') {
			var todate = eval(parseInt(stdDate.getDate()) + parseInt(num));
			stdDate.setDate(todate.toString());
		} else if (type == 'W' || type == 'w') {
			var todate = eval(parseInt(stdDate.getDate()) + (parseInt(num) * 7));
			stdDate.setDate(todate.toString());
		} else if (type == 'M' || type == 'm') {
			var tomonth = eval(parseInt(stdDate.getMonth()) + (parseInt(num)));
			stdDate.setMonth(tomonth, stdDate.getDate());
		} else if (type == 'Y' || type == 'y') {
			var toyear = eval(parseInt(stdDate.getFullYear()) + (parseInt(num)));
			stdDate.setFullYear(toyear);
		} else {
			var todate = eval(parseInt(stdDate.getDate()) + parseInt(num));
			stdDate.setDate(todate.toString());
		}

		var giYear = stdDate.getFullYear();
		var giMonth = stdDate.getMonth() + 1;
		var giDay = stdDate.getDate();

		giMonth = "0" + giMonth;
		giMonth = giMonth.substr(giMonth.length - 2, giMonth.length);
		giDay = "0" + giDay;
		giDay = giDay.substring(giDay.length - 2, giDay.length);

		// alert ( giYear + "/" + giMonth + "/" + giDay );

		result = giYear + giMonth + giDay;

		// alert ( result );

		return result;
	},
	 // as-is 임시 function
/*******************************************************************************
 * 1) function 명 : fnc_chgDateFormat( before, after ) 2) function 설명 : 날짜의 포맷을
 * 변환 3) parameter 설명 : before : 변환할 날짜 ( yyyymmdd, yyyy/mm/dd, yyyy-mm-dd,
 * yyyy.mm.dd, yyymm, yyyy/mm, yyyy-mm, yyyyy.mm) after : 변경할 날짜 포맷 4) return 값 :
 * true / false 5) 변경 이력 : 2012.06.15 - 최초작성 ( lsh )
 ******************************************************************************/
	chgDateFormat : function(before, after) {
		// yyyymmdd, yyyy/mm/dd, yyyy-mm-dd, yyyy.mm.dd,
		// yyyymm, yyyy/mm, yyyy-mm, yyyyy.mm 만 지원..
		var result = null;
		var yyyymmdd = util.clearDateFormat(before);
		if (yyyymmdd == "")
			return before;

		if (after.length == 8) {
			result = yyyymmdd;
		} else if (after.length == 10) {
			if (yyyymmdd.length == 8) {
				var SEP = after.substr(4, 1);
				// alert (SEP);
				var YYYY = yyyymmdd.substr(0, 4);
				var MM = yyyymmdd.substr(4, 2);
				var DD = yyyymmdd.substr(6, 2);
				result = YYYY + SEP + MM + SEP + DD;
			} else if (yyyymmdd.length == 6) {
				var SEP = after.substr(4, 1);
				// alert(SEP);
				var YYYY = yyyymmdd.substr(0, 4);
				var MM = yyyymmdd.substr(4, 2);
				result = YYYY + SEP + MM;
			} else {
				return before;
			}
		} else if (after.length == 7) {
			if (yyyymmdd.length == 6) {
				var SEP = after.substr(4, 1);
				var YYYY = yyyymmdd.substr(0, 4);
				var MM = yyyymmdd.substr(4, 2);
				result = YYYY + SEP + MM;
			} else {
				return before;
			}
		} else if (after.length == 6) {
			if (yyyymmdd.length == 6) {

				result = yyyymmdd;
			} else {
				return before;
			}
		}

		else {
			// 형식 오류..
			result = before;
		}

		// alert( result );
		return result;
	},
	// as-is 임시 function
/*******************************************************************************
 * 1) function 명 : fnc_isValidDate( date ) 2) function 설명 : 날짜 형식이 유효한지 여부 확인 3)
 * parameter 설명 : date : 검증할 날짜 형태의 문자열 (YYYYMMDD, YYYY/MM/DD, YYYY-MM-DD,
 * YYYY.MM.DD ) 4) return 값 : true / false 5) 변경 이력 : 2012.06.15 - 최초작성 ( lsh )
 ******************************************************************************/
	isValidDate : function(date) {
		var flag = true; // true when validation successful.

		if (date == "" || date == "undefined")
			return false;

		// alert( date );

		// Validation Logic for Date..
		var iYear = null;
		var iMonth = null;
		var iDay = null;
		var iDaysInMonth = null;

		var sDate = util.clearDateFormat(date);
		if (sDate == "")
			return false;

		if (util.isDigit(sDate) == false)
			return false;
		// alert( sDate );

		// var sFormat="YYYYMMDD"; //아직까지 YYYYMMDD의 형태만 지원한다. --;
		var aDaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

		if (sDate.length != 8)
			flag = false;

		if (flag) {
			iYear = eval(sDate.substr(0, 4));

			iMonth = eval(sDate.substr(4, 2));
			iDay = eval(sDate.substr(6, 2));

			if (!util.isDigit(iYear.toString()) || !util.isDigit(iMonth.toString())
					|| !util.isDigit(iDay.toString()))
				flag = false;

		}

		if (flag) {
			iDaysInMonth = (iMonth != 2) ? aDaysInMonth[iMonth - 1]
					: ((iYear % 4 == 0 && iYear % 100 != 0 || iYear % 400 == 0) ? 29
							: 28);

			if (iDay == null || iMonth == null || iYear == null || iMonth > 12
					|| iMonth < 1 || iDay < 1 || iDay > iDaysInMonth)
				flag = false;
		}

		delete aDaysInMonth;

		// alert( flag );
		return flag;
	},
	// as-is 임시 function
/*******************************************************************************
 * 1) function 명 : fnc_isvalidfromtodate(fromdate, todate) 2) function 설명 :
 * 시작날짜가 종료날짜보다 작은지 여부 확인 3) parameter 설명 : fromdate : 시작 날짜 todate : 종료 날짜 4)
 * return 값 : true / false 5) 변경 이력 : 2012.06.15 - 최초작성 ( lsh )
 ******************************************************************************/
	isvalidfromtodate : function(fromdate, todate) {
		var startdate = util.clearDateFormat(fromdate);
		var enddate = util.clearDateFormat(todate);
		var result = true;

		if (startdate.length < 8 || enddate.length < 8)
			result = false;

		if (result) {
			var diff = eval(enddate - startdate);
			if (diff < 0)
				result = false;
			else
				result = true;
		}
		// alert( result );
		return result;
	},
	// as-is 임시 function
/*******************************************************************************
 * 1) function 명 : fnc_lpad( str, length, padchar ) 2) function 설명 : 문자열의 왼쪽에
 * 요청된 문자로 Padding 수행 3) parameter 설명 : str : padding 하기전 문자열 padding : padding
 * 할 길이 padchar : padding 할 문자열 4) return 값 : true / false 5) 변경 이력 : 2012.06.15 -
 * 최초작성 ( lsh )
 ******************************************************************************/
	lpad : function(str, length, padchar) {
		var padstr = "";
		var result = "";

		if (padchar == "" || padstr == "undefined")
			return str;
		if (padchar.length != 1) {
			alert("대체텍스트는 한자리 문자로 정의되어야 합니다.");
			return str;
		}

		for (idx = 0; idx < length; idx++) {
			padstr = padstr + padchar;
		}

		result = padstr + str;
		// alert("[" + result + "]");

		return result;
	},
	// as-is 임시 function
/*******************************************************************************
 * 1) function 명 : fnc_rpad( str, length, padchar ) 2) function 설명 : 문자열의 오른쪽에
 * 요청된 문자로 Padding 수행 3) parameter 설명 : str : padding 하기전 문자열 padding : padding
 * 할 길이 padchar : padding 할 문자열 4) return 값 : true / false 5) 변경 이력 : 2012.06.15 -
 * 최초작성 ( lsh )
 ******************************************************************************/
	rpad : function(str, length, padchar) {
		var padstr = "";
		var result = "";

		if (padchar == "" || padstr == "undefined")
			return str;
		if (padchar.length != 1) {
			alert("대체텍스트는 한자리 문자로 정의되어야 합니다.");
			return str;
		}

		for (idx = 0; idx < length; idx++) {
			padstr = padstr + padchar;
		}

		result = str + padstr;
		// alert("[" + result + "]");

		return result;
	},
	// 숫자만 입력
	numberOnly : function(obj) {
		var thisVal = obj.value;
		var maxLength = obj.maxLength;

		// 최대길이가 선언되었으며, 입려한 값이 최대길이보다 큰 경우
		if (maxLength > 0 && thisVal.length > maxLength) {
			thisVal = thisVal.slice(0, maxLength);
			obj.value = thisVal;
		}

		// 입력한 값 숫자 정규식 검증
		for (var i=0; i < thisVal.length; i++) {
			var chk = thisVal.substring(i, i + 1);
			if (!util.regNum(chk)) {
				obj.value = thisVal.substring(0, i);
			}
		}
	},
	// 한글 정규식
	regKor : function(data) {
		var reg = /^[가-힣]/;
		return util.regChk(reg, data);
	},
	// 영어 정규식
	regEng : function(data) {
		var reg = /^[a-zA-Z]/;
		return util.regChk(reg, data);
	},
	// 숫자 정규식
	regNum : function(data) {
		var reg = /^[0-9]/;
		return util.regChk(reg, data);
	},
	// 정규식 검증
	regChk : function(reg, data) {
		for (var i=0; i < data.length; i++) {
			var chk = data.substring(i, i + 1);

			if (!reg.test(chk)) {
				return reg.test(chk);
			}
		}

		return true;
	},
	// 생년월일(6자리) 정규식
	regBirth : function(data) {
		var reg = /^\d{2}([0][1-9]|[1][0-2])(0[1-9]|[1-2][0-9]|[3][0-1])$/;
		return reg.test(data);
	},
	// 휴대폰번호 정규식
	regCellPhone : function(data) {
		var reg = /^01([0|1|6|7|8|9])([0-9]{4})([0-9]{4})$/;
		return reg.test(data);
	},
	// 세자리마다 콤마 찍기
	setComma : function(num) {
		var len, point, str;

		num = num + "";
		num = num.replace(/,/gi, "");

		len = num.length;
		point = len % 3;

		str = num.substring(0, point);

		while(point < len) {
			if (str != "") str += ",";
			str += num.substring(point, point + 3);
			point += 3;
		}

		return str;
	},
	// 숫자 한글로 변환
	numToHan : function(num) {
		num = num + "";
		num = num.replace(/,/gi, "");

		// 숫자만 있는 문자열로 변환
		num = parseInt(num.replace(/[^0-9]/g, ""), 10) + "";

		if (num == "0") return "영";

		var result = [];

		var unitCnt = Math.ceil(num.length / 4);
		num = num.padStart(unitCnt * 4, "0");

		var reg = /[\w\W]{4}/g;
		var arr = num.match(reg);

		for(var i=arr.length-1, unitCnt=0; i>=0; i--, unitCnt++) {
			var hanVal = util.makeHan(arr[i]);
			if (hanVal == "") continue;
			result.unshift(hanVal + unit[unitCnt]);
		}

		return result.join("");
	},
	/* 숫자 숫자(,)한글 [1,000만] 변환 */
	numToCommaHan : function(num) {
		num = num + "";
		number = parseInt(num.replace(/,/gi, ""));
		// console.log(">>>>>>in:one:", number);
		let inputNumber  = number < 0 ? false : number;
		let unitWords    = ['', '만', '억', '조', '경']
		let splitUnit    = 10000;
		let splitCount   = unitWords.length;
		let resultArray  = [];
		let resultString = '';
		for(let i = 0; i < splitCount; i++) {
			let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
			unitResult = Math.floor(unitResult);
			if(unitResult > 0) {
				resultArray[i] = unitResult;
			}
		}
		for(let i = 0; i < resultArray.length; i++) {
			if(!resultArray[i]) continue;
			let numWithComma = (resultArray[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			resultString = String(numWithComma) + unitWords[i] + resultString;
		}
		return resultString;
	},
	makeHan : function(text) {
		var str = "";
		for(var i=0; i < text.length; i++) {
			var num = text[i];
			// '0' 은 읽지 않음
			if (num == "0") continue;
			str += number[num] + smallUnit[i];
		}

		return str;
	},
	// 주민등록번호, 외국인등록번호, 외국인 거소번호 조회 마스킹
	maskRegNum : function(str){
		str = str + "";
		str = str.replace(/-/gi,"");

		return str.substr(0,6) + "-" + str.substr(6,1);
	},
	// 운전면허번호 조회 마스킹
	maskDriveLicense: function(str){
		str = str + "";

		while (str.length != str.replace(/-/gi, "").length) {
			str = str.replace("-", "");
		}

		var strMask = str.substr(0,2) +"-" + str.substr(2,2) + "-" + "******-" + str.substr(10,2);

		return strMask;
	},
	// 성명 조회 마스킹
	maskNm : function(str){
		str = str.substr(0,1)+ "*" + str.substr(2);

		return str;
	},
	// 휴대폰번호 조회 마스킹
	maskPhoneNum : function(str){
		str = str + "";
		str = str.replace(/-/gi,"");

		return str.substr(0,3) + "-" + "****" + "-" + str.substr(7,4);
	},
	// 전화번호 조회 마스킹
	maskTelNum : function(str){
		str = str + "";
		str = str.replace(/-/gi,"");

		if (str.substr(0,2) == "02"){
			if (str.length == 9){
				return str.substr(0,2) + "-" + "***" + "-"	+ str.substr(5,4);
			}
			else{
				return str.substr(0,2) + "-" + "****" + "-" + str.substr(6,4);
			}

		} else {
			if (str.length == 10){
				return str.substr(0,3) + "-" + "***" + "-" + str.substr(6,4);
			}
			else{
				return str.substr(0,3) + "-" + "****" + "-" + str.substr(7,4);
			}
		}
	},
	// E-Mail 조회 마스킹
	maskEmail : function(str){
		var masking = "";
		var splitValue = [];
		// '@'로 문자열 분리
		splitValue = str.split('@');

		var len = splitValue[0].substring(3,splitValue[0].length).length;

		for (var i = 0; i< len ; i++){
			masking += "*" ;
		}

		return splitValue[0].substr(0,3) + masking+ "@" + splitValue[1];
	},
	// 주소 조회 마스킹
	// 입력값 : 기본주소, 상세주소
	maskAddr : function(baseAddr, detailAddr) {
	 var masking = "";

	 for (var i=0; i< detailAddr.length ; i++){
		masking += "*";
	 }

	 return baseAddr + " " + masking;
	},
	// 사업자번호 조회 마스킹
	maskBusiNum : function(str){
		str = str + "";
		str = str.replace(/-/gi,"");

		return str.substr(0,3)+ "-" + str.substr(3,2) + "-" +"*****";
	},
	// 증권번호 조회 마스킹
	maskContNum : function(str){
		str = str +"";
		str = str.replace(/-/gi,"");

		if (str.length == 12){
		 return str.substr(0,5) + "****" + str.substr(9,3);
		}
		else if (str.length == 9){
		 return str.substr(0,3) + "****" + str.substring(7);
		}
	},
	// 계좌번호 조회 마스킹
	maskAccountNum : function(str){
		str = str +"";
		str = str.replace(/-/gi,"");

		var lastLen = str.length - 8;

		return str.substr(0,4)+ "****" + str.substr(8,lastLen);
	},
	// 카드번호 조회 마스킹
	maskCardNum : function(str){
		str = str +"";
		str = str.replace(/-/gi,"");

		return str.substr(0,4) + "-" + str.substr(4,2) + "**-****-" + str.substr(12,4);
	},

	// number Type 최대 입력 길이 제한
  numMaxLength : function(obj) {
    if (obj.value.length > obj.maxLength) {
      var retVal = obj.value.slice(0, obj.maxLength);
      obj.value = retVal;
    }
  },

  // 조회시작일과 조회종료일의 범위
  diffDate : function(strDate, endDate) {
    var ys= strDate.substring(0,4);
    var ms= strDate.substring(4,6);
    var ds= strDate.substring(6,8);
    var ye= endDate.substring(0,4);
    var me= endDate.substring(4,6);
    var de= endDate.substring(6,8);

    var sday = new Date(ys, (ms-1), ds);
    var eday = new Date(ye, (me-1), de);

    var g_sday = sday.getTime();
    var g_eday = eday.getTime();

    var cnt = g_eday - g_sday + 1;

    return Math.ceil(cnt / (24* 60 * 60 * 1000));
  },

	// fnc_clearComma
	clearComma : function(commaval) {
		var str_commaval = String(commaval);
		var result = str_commaval.replace(/,/g,"");

		return result;
	},
	/** 전화번호 split 후 Array 리턴 but 숫자형식이 아닌 경우 undefined 리턴 */
	splitNum4Phone : function(pNumber) {
		// 02, 03X[123], 04X[1234], 05X[12345], 06X[1234], 010(7,8)
		let numRegEx = /^\d+$/;
		let isCellPhone = numRegEx.test(pNumber) && pNumber.startsWith("010") && (pNumber.length === 10 || pNumber.length === 11);
		let isTelePhone = numRegEx.test(pNumber) && pNumber.startsWith("0") && (8 < pNumber.length && pNumber.length < 12);
		let phNum;
		if(isCellPhone) {
			// 000-000-0000, 000-0000-0000
			phNum = pNumber.replace(/^(\d{0,3})(\d{3,4})(\d{4})$/g, "$1-$2-$3");
		} else if(isTelePhone) {
			// 00-000-0000, 00-0000-0000
			phNum = pNumber.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
		} else {
			console.debug("__isTelePhone:", isTelePhone);
			console.debug("__Not Phone Number__:", pNumber);
		}
		let rvArr;
		if(phNum) {
			rvArr = phNum.split("-");
		}
		console.log(">>> rvArr:", rvArr);
		return rvArr;
	}

} /** End of Util. */

// 세션스토리지 구성
var KSS = {};
__SessionStorageManager = function() {
	this.storage = sessionStorage;

	this.setItem = function(key, data) {
		try {
			var jsonStr = JSON.stringify(data);
			this.storage.setItem(key, jsonStr);
		} catch (e) {
			console.log(e.toString());
		}
	};

	this.getItem = function(key) {
		try {
			var strJSON = this.storage.getItem(key);

			// strJSON이 undefiend일 경우 null 반환
			if (strJSON == 'undefined') {
				return;
			}

			return JSON.parse(strJSON);
		} catch (e) {
			console.log(e.toString());
		}
	};

	this.remove = function(key) {
		try {
			this.storage.removeItem(key);
		} catch (e) {
			console.log(e.toString());
		}
	};

	this.removeAll = function() {
		try {
			this.storage.clear();
		} catch (e) {
			console.log(e.toString());
		}
	};
};

KSS.ssManager = new __SessionStorageManager;
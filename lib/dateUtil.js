
//定义时间工具
var myDate = {};

myDate.getFullDate = function(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	if(month<10) month= "0"+month;
	var day = date.getDate();
	if(day<10) day= "0"+day;
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
}
module.exports = myDate;
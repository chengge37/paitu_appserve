const Format = {
    formatDate:function(secs){ //123456789 --> 年-月-日 时：分：秒
                var t = new Date(secs);
                var year = t.getFullYear();
                var month = t.getMonth() + 1;
                if(month < 10){month = '0' + month;}
                var date = t.getDate();
                if(date < 10){date = '0' + date;}
                var hour = t.getHours();
                if(hour < 10){hour = '0' + hour;}
                var minute = t.getMinutes();
                if(minute < 10){minute = '0' + minute;}
                var second = t.getSeconds();
                if(second < 10){second = '0' + second;}
                return year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
            },
    formatDate0:function(secs,flag){ //123456789 --> 年-月-日 时：分：秒   flag为true，返回235959，false000000
                var t = new Date(secs);
                var year = t.getFullYear();
                var month = t.getMonth() + 1;
                if(month < 10){month = '0' + month;}
                var date = t.getDate();
                if(date < 10){date = '0' + date;}
                var hour = t.getHours();
                if(hour < 10){hour = '0' + hour;}
                var minute = t.getMinutes();
                if(minute < 10){minute = '0' + minute;}
                var second = t.getSeconds();
                if(second < 10){second = '0' + second;}
                if(flag){return year+'-'+month+'-'+date+' '+'23:59:59';}
                return year+'-'+month+'-'+date+' '+'00:00:00';
            },
    formatDateNoSecond:function(secs){//123456789 --> 年-月-日 时：分
                var t = new Date(secs);
                var year = t.getFullYear();
                var month = t.getMonth() + 1;
                if(month < 10){month = '0' + month;}
                var date = t.getDate();
                if(date < 10){date = '0' + date;}
                var hour = t.getHours();
                if(hour < 10){hour = '0' + hour;}
                var minute = t.getMinutes();
                if(minute < 10){minute = '0' + minute;}
                var second = t.getSeconds();
                if(second < 10){second = '0' + second;}
                return year+'-'+month+'-'+date+' '+hour+':'+minute;
            },
    formatDateHourMinute:function(secs){//123456789 --> 年-月-日 时：分
                var t = new Date(secs);
                var hour = t.getHours();
                if(hour < 10){hour = '0' + hour;}
                var minute = t.getMinutes();
                if(minute < 10){minute = '0' + minute;}
                return hour+':'+minute;
            },
    formatDateNoHouer:function(secs){//123456789 --> 年-月-日
                var t = new Date(secs);
                var year = t.getFullYear();
                var month = t.getMonth() + 1;
                if(month < 10){month = '0' + month;}
                var date = t.getDate();
                if(date < 10){date = '0' + date;}
                var hour = t.getHours();
                if(hour < 10){hour = '0' + hour;}
                var minute = t.getMinutes();
                if(minute < 10){minute = '0' + minute;}
                var second = t.getSeconds();
                if(second < 10){second = '0' + second;}
                return year+'-'+month+'-'+date;
            },
    formatDateNoDay:function(secs){//123456789 --> 年-月-日
                var t = new Date(secs);
                var year = t.getFullYear();
                var month = t.getMonth() + 1;
                if(month < 10){month = '0' + month;}
                var date = t.getDate();
                if(date < 10){date = '0' + date;}
                var hour = t.getHours();
                if(hour < 10){hour = '0' + hour;}
                var minute = t.getMinutes();
                if(minute < 10){minute = '0' + minute;}
                var second = t.getSeconds();
                if(second < 10){second = '0' + second;}
                return year+'-'+month;
            }
}

export {Format}
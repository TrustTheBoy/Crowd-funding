$(document).ready(function(){
    //选择日期控件
    $("input.jcDate").jcDate({
        IcoClass : "jcDateIco",
        Event : "click",
        Speed : 100,
        Left :-125,
        Top : 28,
        format : "-",
        Timeout : 100,
        Oldyearall : 17,  // 配置过去多少年
        Newyearall : 0  // 配置未来多少年
    });
    $("#add_share_bonus").bind("click",function(){
		if($("input[name='money']").val() == ''){
			$.showErr("本期分红金额不能为空！");
			return false;
		}
		if($("input[name='begin_time']").val() == ''){
			$.showErr("发放开始时间不能为空！");
			return false;
		}
		if($("input[name='end_time']").val() == ''){
			$.showErr("发放结束时间不能为空！");
			return false;
		}
        add_share_bonus();
    });
    bind_ajax_share_bonus_form();
});
function add_share_bonus(){
    var share_bonus_html = $(".share_bonus_demo").html();
    var $share_bonus_list = $("#share_bonus_list");
    var $setting_share_bonus = $("#setting_share_bonus");
    var year = $setting_share_bonus.find("select[name='year'] option:selected").val();
    var number = $setting_share_bonus.find("select[name='number'] option:selected").val();
    var begin_time = $setting_share_bonus.find("input[name='begin_time']").val();
    var end_time = $setting_share_bonus.find("input[name='end_time']").val();
    money = $setting_share_bonus.find("input[name='money']").val();

    var new_share_bonus_html=share_bonus_html.replace(/number_hide/g,"number");
    new_share_bonus_html=new_share_bonus_html.replace(/year_hide/g,"year");
    new_share_bonus_html=new_share_bonus_html.replace(/money_hide/g,"money");
    new_share_bonus_html=new_share_bonus_html.replace(/average_monthly_returns_hide/g,"average_monthly_returns");
    new_share_bonus_html=new_share_bonus_html.replace(/average_annualized_return_hide/g,"average_annualized_return");
    new_share_bonus_html=new_share_bonus_html.replace(/begin_time_hide/g,"begin_time");
    new_share_bonus_html=new_share_bonus_html.replace(/end_time_hide/g,"end_time");
    new_share_bonus_html=new_share_bonus_html.replace(/notice_sn_hide/g,"notice_sn");
    new_share_bonus_html=new_share_bonus_html.replace(/investor_hide/g,"investor");
    new_share_bonus_html=new_share_bonus_html.replace(/percentage_shares_hide/g,"percentage_shares");
    new_share_bonus_html=new_share_bonus_html.replace(/amount_hide/g,"amount");

    if(!average_monthly_returns){
		 if($("#share_bonus_list").children().length==0){
	        $("#share_bonus_list").append(new_share_bonus_html);
	    }
	}
   
    $share_bonus_list.find(".uc_table").eq(1).attr('id','user_share_bonus_table');

    $share_bonus_list.find("input[name='year']").val(year);
    $share_bonus_list.find("#year").html(year);
    $share_bonus_list.find("input[name='number']").val(number);
    $share_bonus_list.find("#number").html(number);
    $share_bonus_list.find("input[name='money']").val(money);
    $share_bonus_list.find("#money").html(money);
    $share_bonus_list.find("input[name='begin_time']").val(begin_time);
    $share_bonus_list.find("#begin_time").html(begin_time);
    $share_bonus_list.find("input[name='end_time']").val(end_time);
    $share_bonus_list.find("#end_time").html(end_time);

    var off_days = DateDiff(begin_time,end_time);
    var month_return_rate = count_month_return_rate(money,limit_price,off_days);
    var year_return_rate = count_year_return_rate(money,limit_price,off_days);

    $share_bonus_list.find("input[name='average_monthly_returns']").val(month_return_rate);
    $share_bonus_list.find("#average_monthly_returns").html(month_return_rate+"%");
    $share_bonus_list.find("input[name='average_annualized_return']").val(year_return_rate);
    $share_bonus_list.find("#average_annualized_return").html(year_return_rate+"%");

    // 分红金额
    count_amount();
}
// 计算分红金额
var amount = new Array();
function count_amount(){
    $("input[name='percentage_shares']").each(function(i){
        var percentage_shares = $(this).val();
        amount[i] = parseFloat(money*(percentage_shares/100)).toFixed(2);
        $("input[name='amount']").eq(i).val(amount[i]).prev(".amount").html(amount[i]);
    });
}

// 计算平均月回报率
function count_month_return_rate(money,limit_price,off_days){
	if(off_days){
		return parseFloat((money/limit_price/(off_days/30))*100).toFixed(4);
	}
    else{
		return 0;
	}
}

// 计算平均年回报率
function count_year_return_rate(money,limit_price,off_days){
	if(off_days){
    	return parseFloat(((money/limit_price/(off_days/30))*12)*100).toFixed(4);
	}
    else{
		return 0;
	}
}

// 时间差
function DateDiff(sDate1,sDate2)
{ 
    var arrDate,objDate1,objDate2,intDays;
    arrDate=sDate1.split("-");
    objDate1=new Date(arrDate[1]+'-'+arrDate[2]+'-'+arrDate[0]);
    arrDate=sDate2.split("-");
    objDate2=new Date(arrDate[1] + '-'+arrDate[2]+'-'+arrDate[0]);
    intDays=parseInt(Math.abs(objDate1-objDate2)/1000/60/60/24);
    return intDays;
}

// 用户分红表格数据存入数组
var share_bonus_array = [];
function into_share_bonus_array(){
	share_bonus_array = [];
    var oTab = document.getElementById("user_share_bonus_table");
    var rows = oTab.rows;
    for(var iRow =1;iRow<rows.length;iRow++){
        var oRow=[];
        var oCells = rows.item(iRow).cells;
        for(var iCol=0;iCol<oCells.length;iCol++){
            oRow[iCol]=oCells[iCol].innerText;
        }
        share_bonus_array.push(oRow);
    }
   // bind_jsonstr();
}

// 转json
var jsonstr;
function bind_jsonstr(){
    var i;
    jsonstr="[{";
    for(i=0;i<share_bonus_array.length;i++)
    {
    jsonstr += "\"" + "arrty" + [i] + "\""+ ":" + "\"" + share_bonus_array[i] + "\",";
    }
    jsonstr = jsonstr.substring(0,jsonstr.lastIndexOf(','));
    jsonstr += "}]";
    return jsonstr;
}

function bind_ajax_share_bonus_form(){
    $(".ajax_share_bonus_form").find(".ui-button").bind("click",function(){
		if($("input[name='money']").val() == ''){
			$.showErr("本期分红金额不能为空！");
			return false;
		}
		if($("input[name='begin_time']").val() == ''){
			$.showErr("发放开始时间不能为空！");
			return false;
		}
		if($("input[name='end_time']").val() == ''){
			$.showErr("发放结束时间不能为空！");
			return false;
		}
		if($("#share_bonus_list").children().length==0){
			$.showErr("请先生成分红明细！");
			return false;
		}
		if($("input[name='money']").val()!=$("#money").html()){
			$.showErr("分红金额发生变化，请重新生成分红明细！");
			return false;
		}
		if($("input[name='begin_time']").val()!=$("#begin_time").html()){
			$.showErr("发放开始时间发生变化，请重新生成分红明细！");
			return false;
		}
		if($("input[name='end_time']").val()!=$("#end_time").html()){
			$.showErr("发放结束时间发生变化，请重新生成分红明细！！");
			return false;
		}
        $(".ajax_share_bonus_form").submit();
    });
    $(".ajax_share_bonus_form").bind("submit",function(){
        // 用户分红表格数据存入数组 实例化
        into_share_bonus_array();

        var ajaxurl = $(this).attr("action");
        var query = new Object();
        query.share_bonus_array = share_bonus_array;
        query.number = $("input[name='number']").val();
        query.year = $("input[name='year']").val();
        query.money = $("input[name='money']").val();
        query.average_monthly_returns = $("input[name='average_monthly_returns']").val();
        query.average_annualized_return = $("input[name='average_annualized_return']").val();
        query.begin_time = $("input[name='begin_time']").val();
        query.end_time = $("input[name='end_time']").val();
        query.descripe = $("textarea[name='descripe']").val();
		query.ajax = $("input[name='ajax']").val();
		query.deal_id = $("input[name='deal_id']").val();
		query.id = $("input[name='id']").val();
        $.ajax({ 
            url: ajaxurl,
            dataType: "json",
            data:query,
            type: "POST",
            success: function(ajaxobj){
                if(ajaxobj.status)
                {
                    $.showSuccess(ajaxobj.info,function(){
                         location.href = ajaxobj.jump;
                    });
                }
                else
                {
                    if(ajaxobj.jump!="")
                        location.href = ajaxobj.jump;
                    else
                    $.showErr(ajaxobj.info);
                }                       
            },
            error:function(ajaxobj)
            {
                // if(ajaxobj.responseText!='')
                // alert(ajaxobj.responseText);
            }
        });
        return false;
    });
}
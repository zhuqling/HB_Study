define("admin/order/purchase/hotel-index", ["baseUI", 'linkFile/order/orderFile', "util", "other/clsPage", 'jasonweb/jasonPopup'], function (require, exports, module) {
    var $ = require("baseUI");
    var util = require("util");
    var api = require("linkFile/order/orderFile");


    var hotelIndex = function (opt) {
        var self = this;
        self.opt = $.extend({}, {}, opt);

        self.main = '#order-hotel-index';

        self.list = {};
        self.api = api().admin.order.purchase.hotelNode;
        self.engine = api().admin.order.purchase.engineNode;

        //数据列表
        self.dataList = [];
        //订单状态（对象）
        self.OrderStatusObj = {
            CANCEL: "已取消",
            COMPLETE: "已完成",
            PAIED_ALL: "已付全款",
            REFUND_ALL: "全部退订",
            WAIT_PAY: "等待付款"
        };
        //订单状态（列表）
        self.OrderStatus = '';
        //返回数据对象
        self.data = {};
        //用户类型对象
        self.userTypeObj = {
            company: 'COMPANY',
            personal: 'PERSONAL'
        };

        //用户类型
        self.userType = self.userTypeObj.personal;
        // 查询参数
        self.queryParams = {
            currentPage: 1,
            pageSize: 10
        };
        //是否为全部订单状态（导航栏）
        if(util.getParam('tab')){
            self.isNavStatusAll = false;
            self.OrderStatus = util.getParam('tab');
        }else{
            self.isNavStatusAll = true;
        }
    };

    hotelIndex.prototype = {
        init: function () {
            var self = this;
            self.ajaxData();
        },
        ajaxData: function () {
            var self = this;
            self.showPages();
        },
        showPages: function () {
            var self = this;
            self.hotelIndexDom();
            self.airIndexEvent();
        },
        hotelIndexDom: function () {
            var self = this
                ,template = '' +
                '<div id="order-hotel-index" class="order-hotel-index">' +
                '    <div class="breadcrumb-header">' +
                '        <ul class="breadcrumb">' +
                '            <li style="padding-left: 15px;">当前位置：</li>' +
                '            <li>订单管理 <span class="divider">&gt;</span></li>' +
//                '            <li class="active">采购订单 <span class="divider">&gt;</span></li>' +
                '            <li class="active">酒店</li>' +
                '        </ul>' +
                '    </div>' +

                '    <div class="panel">' +
                '        <div class="panel-title-content">' +
                '            <ul class="nav nav-tabs js-user-type">' +
                /*'                <li class="active">' +
                '                    <a data-toggle="tab" data-user-type="company">企业订单 <span class="badge badge-red js-company-number" style="display: none"></span></a>' +
                '                </li>' +*/
                '                <li class="active">' +
                '                    <a data-toggle="tab" data-user-type="personal">个人订单 <span class="badge badge-red js-personal-number" style="display: none"></span></a>' +
                '                </li>' +
                '            </ul>' +
                '        </div>' +
                '        <div class="panel-content">' +

                '            <ul class="nav nav-tabs js-order-status">' +
                '                <li '+(self.OrderStatus == '' ? 'class="active"':'')+'>' +
                '                    <a data-toggle="tab" data-order-status="ALL" >全部订单</a>' +
                '                </li>' +
                '                <li '+(self.OrderStatus == 'WAIT_PAY' ? 'class="active"':'')+'>' +
                '                    <a data-toggle="tab" data-order-status="WAIT_PAY">等待付款</a>' +
                '                </li>' +
                '                <li '+(self.OrderStatus == 'PAIED_ALL' ? 'class="active"':'')+'>' +
                '                    <a data-toggle="tab" data-order-status="PAIED_ALL">已付全款</a>' +
                '                </li>' +
                '                <li '+(self.OrderStatus == 'COMPLETE' ? 'class="active"':'')+'>' +
                '                    <a data-toggle="tab" data-order-status="COMPLETE">已完成</a>' +
                '                </li>' +
                '                <li '+(self.OrderStatus == 'REFUND_ALL' ? 'class="active"':'')+'>' +
                '                    <a data-toggle="tab" data-order-status="REFUND_ALL">全部退订</a>' +
                '                </li>' +
                '            </ul>' +

                '            <div class="panel-content-page">' +
                '                <div class="form form-inline">' +
                '                    <div class="control-group">' +
                '                        <div class="controls">' +
                '                            <div class="input-append">' +
                '                                <input class="input-text input-xxlarge js-input-keywords" type="text"' +
                '                                       placeholder="请输入订单号或产品名称" submit="keywords">' +
                '                                <div class="btn-group">' +
                '                                    <button class="btn btn-orange js-order-search" data-type="1">查询</button>' +
                '                                    <span class="advance-search js-hotel-index-more-search">' +
                '				                                	<a href="javascript:void(0);" class="">更多筛选条件 </a>' +
                '				                                	<i class="icon-font icon-tip-down"' +
                '                                                       style="color: #45B3F0;font-size: 20px;position: absolute;"></i>' +
                '				                                </span>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="js-search-hide form form-inline" style="display: none">' +

                '                    <div class="control-group">' +
                '                        <label class="control-label">订单编号：</label>' +

                '                        <div class="controls">' +
                '                            <input class="input-text" type="text" placeholder="" submit="orderNo" validation="number-word">' +
                '                        </div>' +
                '                    </div>' +

                    /*'                    <div class="control-group">'+
                     '                        <label class="control-label">销售单号：</label>'+

                     '                        <div class="controls">'+
                     '                            <input class="input-text" type="text" placeholder="" submit="orderNo">'+
                     '                        </div>'+
                     '                    </div>'+*/

                '                    <div class="control-group">' +
                '                        <label class="control-label">销售单号：</label>' +

                '                        <div class="controls">' +
                '                            <input class="input-text" type="text" placeholder="" submit="saleOrderNo" validation="number-word">' +
                '                        </div>' +
                '                    </div>' +

                '                    <div class="control-group">' +
                '                        <label class="control-label">下单日期：</label>' +

                '                        <div class="controls">' +
                '                            <div class="input-icon js-input-calendar-start">' +
                '                                <input class="input-text js-order-travelstartdate" type="text" placeholder="请输入开始日期"' +
                '                                       value="" readonly="readonly" submit="startCreateTime">' +

                '                                <div class="btn-group">' +
                '                                    <i class="icon-font icon-calendar"></i>' +
                '                                </div>' +
                '                            </div>' +
                '                            <span class="sepr">-</span>' +

                '                            <div class="input-icon js-input-calendar-end">' +
                '                                <input class="input-text js-order-travelenddate" type="text" placeholder="请输入结束日期"' +
                '                                       value="" readonly="readonly" submit="endCreateTime">' +

                '                                <div class="btn-group">' +
                '                                    <i class="icon-font icon-calendar"></i>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +

                '                    <div class="control-group">' +
                '                        <label class="control-label">住客联系人手机号：</label>' +

                '                        <div class="controls">' +
                '                            <input class="input-text" type="text" placeholder="" submit="cusLinkman">' +
                '                        </div>' +
                '                    </div>' +

                '                    <div class="control-group">' +
                '                        <label class="control-label">入住日期：</label>' +

                '                        <div class="controls">' +
                '                            <div class="input-icon js-input-calendar-start">' +
                '                                <input class="input-text js-order-travelstartdate" type="text" placeholder="请输入开始日期"' +
                '                                       value="" readonly="readonly"  submit="startTime">' +

                '                                <div class="btn-group">' +
                '                                    <i class="icon-font icon-calendar"></i>' +
                '                                </div>' +
                '                            </div>' +
                '                            <span class="sepr">-</span>' +

                '                            <div class="input-icon js-input-calendar-end">' +
                '                                <input class="input-text js-order-travelenddate" type="text" placeholder="请输入结束日期"' +
                '                                       value="" readonly="readonly" submit="endTime">' +

                '                                <div class="btn-group">' +
                '                                    <i class="icon-font icon-calendar"></i>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +

                '                    <div class="control-group">' +
                '                        <label class="control-label">采购会员手机号：</label>' +

                '                        <div class="controls">' +
                '                            <input class="input-text" type="text" placeholder="" submit="purLinkman">' +
                '                        </div>' +
                '                    </div>' +
                '                    <div class="form form-inline">' +
                '                        <div class="control-group">' +
                '                            <div class="controls">' +
                '                                <button class="btn btn-orange js-order-search">查询</button>' +
                '                                <button class="btn btn-white js-hotel-index-reset">重置</button>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <hr class="panel-hr">' +
                '            <div class="panel-content-page pos-relative">' +
                '                <div class="form form-inline">' +
                '                    <div class="control-group">' +
                '                        <button class="btn btn-icon js-table-export"><i class="icon-font icon-export"></i>导出</button>' +
                '                        <button class="btn btn-icon js-table-remark"><i class="icon-font icon-remark"></i>修改备注</button>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="table-scroll">' +
                '                   <table class="table table-style-a js-hotel-table">' +
                '                   </table>' +
                '                </div>' +
                '                <div class="js-hotel-index-page"></div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';
            huilv.show(template);
        },
        airIndexEvent: function () {
            var self = this;


            self.searchList();

            //更多查询条件
            $(self.main).delegate('.js-hotel-index-more-search', 'click', function () {
                var $hide = $('.js-search-hide')
                    , disHide = $hide.css('display');
                if (disHide === 'none') {
                    $hide.show();
                    $(this).find('i').removeClass('icon-tip-down').addClass('icon-tip-up');
                } else {
                    $hide.hide();
                    $(this).find('i').removeClass('icon-tip-up').addClass('icon-tip-down');
                }
            });

            //查询
            $(self.main).delegate('.js-order-search', 'click', function () {
                var type = $(this).attr('data-type');
                self.searchList();
            });

            //重置
            $(self.main).delegate('.js-hotel-index-reset', 'click', function () {
                $('.js-search-hide', self.main).find('.input-text').val('');
                self.searchList();
            });

            //用户类型切换
            $(self.main).delegate('.js-user-type', 'selected', function (e, data) {
                var typeName = data.$selectedElement.attr('data-user-type');
                self.userType = self.userTypeObj[typeName];
                self.searchList();
            });

            //订单状态类型切换（导航栏）
            $(self.main).delegate('.js-order-status', 'selected', function (e, data) {
                var typeName = data.$selectedElement.attr('data-order-status');
                if (typeName === 'ALL') {
                    self.OrderStatus = '';
                    self.isNavStatusAll = true;
                } else {
                    self.OrderStatus = typeName;
                    self.isNavStatusAll = false;
                }
                self.queryParams.currentPage = 1;
                self.searchList();
            });

            //表格订单状态切换
            $(self.main).delegate('.js-option-order-status', 'selected', function (e, data) {
                if (data.dataId === 'ALL') {
                    self.OrderStatus = '';
                } else {
                    self.OrderStatus = data.dataId;
                }
                self.searchList();
            });

            //输入限制
            $(self.main).delegate('.js-search-hide input[validation]', 'change', function (e) {
                var type = $(this).attr('validation')
                    , _this = this;
                if (!/^\S+$/.exec($(this).val().toString())) {
                    return false;
                }
                switch (type) {
                    case 'number-word':
                        if (!/^(\d|\w)+$/.exec($(this).val().toString())) {
                            var text = $(this).closest('.control-group').find('.control-label').text().replace('：', '');
                            util.flashMask(text + '格式错误，此处只能填入数字或字母！', function () {
                                $(_this).val('').focus();
                            });
                        }
                        break;
                }
            });

            //导出到Excel
            $(self.main).delegate('.js-table-export', 'click', function (e) {
                util.submitForm({
                    action: self.api.export_excel + '?token=' + util.token,
                    data: self.queryParams,
                    method: 'post'
                });
                // util.openUrl(self.api.export_excel + '?token='+util.token+'&' + $.param(self.queryParams));
            });
            
            //全选
            $(self.main).delegate('.js-checkbox-all', 'click', function (e) {
            	if($(this).is(':checked')){
            		$(".js-checkbox").each(function(){
            			$(this).attr("checked",true);
            		})
            	}else{
            		$(".js-checkbox").each(function(){
            			$(this).attr("checked",false);
            		})
            	}
            });
            
            //单选
            $(self.main).delegate('.js-checkbox', 'click', function (e) {
            	var count = 0;
            	$(".js-checkbox").each(function(){
            		if($(this).is(':checked')){
            			count ++;
            		}
            	});
            	if(count == self.queryParams.pageSize){
            		$('.js-checkbox-all').attr("checked",true);
            	}else{
            		$('.js-checkbox-all').attr("checked",false);
            	}
            });
            
            //修改备注
            $('.js-table-remark',self.main).bind('click', function (e) {
            	var orderIdArray = [];
        		$('.js-hotel-list tr').each(function(){
        			var checkbox = $(this).find('.js-checkbox');
        			if(checkbox.is(':checked')){
        				var checkboxValue = checkbox.val();
        				orderIdArray.push(checkboxValue);
        			}
        		});
    			if(orderIdArray.length === 0){
        			return util.flashMask("亲!您还没有选择一行哦!");
        		}else{
        			$.jasonPopup({
        				title:'修改订单备注信息',
        				boxStyle:"width:500px;",
        				message:'<div class="form form-horizontal">'+
						'	<div class="control-group">'+
        				'		<div class="controls" style="margin-left: 0;">'+
        				'			<textarea rows="3" class="textarea input-xlarge js-order-remark" placeholder="您可输入订单跟进人、跟进时间、跟进结果等信息" style="width: 435px;"></textarea>'+
        				'		</div>'+
        				'	</div>'+
        				'</div>',
        				doneText:'确认',
        				cancelText:'取消',
        				onShow:function(){
        					$('.js-order-remark').keyup(function(){
        						var val = $(this).val();
        						if (val.length > 300) {
        							$(this).val(val = val.substring(0,300));
        						}
        					});
        				},
        				doneCallback:function(){
        					var remark = $('.js-order-remark').val();
        					var params = {remark:remark,orderIdArray:JSON.stringify(orderIdArray).replace(/\\/g,'')};
        					util.postRsp(self.engine.update , params, function (rsp) {
        						if(rsp.retcode === "0"){
        							$.flashMask(rsp['retmsg']);
        							self.ajaxData();
        						}else{
        							$.flashMask(rsp['retmsg']);
        						}
        					});
        				}
        			});
        		}
            });

            
            //查看退款订单
            $(self.main).delegate('.js-hotel-refund', 'click', function (e) {
                var orderno = $(this).attr('data-orderno');
                huilv.gotoMod('admin/finance/refund-index', {
                	orderno: orderno,
                	isHotel:true
                });
            });
            
            //订单详情
            $(self.main).delegate('.js-hotel-index-order-detail', 'click', function (e) {
                var data = self.getPararentData($(this));
                huilv.gotoMod('admin/order/purchase/hotel-detail', {
                    orderId: data.orderId,
                    showList: data.showList,
                    OrderStatusObj: self.OrderStatusObj
                });
            });

            //退订订单
            $(self.main).delegate('.js-hotel-index-refund-order', 'click', function (e) {
                var data = self.getPararentData($(this));
                /*util.postRsp(self.api.refund, 'orderId=' + data.orderId, function (rsp) {
                    $.flashMask(rsp['retmsg'], 'success', null, $.proxy(self.searchList, self))
                });*/
                huilv.gotoMod('admin/order/purchase/hotel-unsubscribe', {
                	isUnsubscribe:true,
                    orderId:data.orderId,
                    showList: data.showList,
                    fromPage:'admin/order/purchase/hotel-index'
                });
            });
            
            //取消订单
            $(self.main).delegate('.js-hotel-index-cancel-order', 'click', function (e) {
                var data = self.getPararentData($(this));
                $.confirmDlg('亲,您确定要取消此订单吗？',function(){
                	util.postRsp(self.api.cancel , 'orderId=' + data.orderId, function (rsp) {
                        $.flashMask(rsp['retmsg'], 'success', null, $.proxy(self.searchList, self))
                    });
        		});
            });
            
        },
        getPararentData: function (target) {
            var parenet = target.closest('tr');
            return {
                orderId: parenet.attr('data-order-id'),
                versionNo: parenet.attr('data-version-no'),
                showList: "cancelList,refundList,refundRules,cusLinkman,purLinkman,customerList"//cancelList,refundList,refundRules,cusLinkman,purLinkman,customerList
            };
        },
        getAdvanceSearchParam: function () {
            var self = this
                , search = $('.js-search-hide', self.main);
            self.queryParams = $.extend({}, self.queryParams, {
                keywords: $('.js-input-keywords', self.main).getVal(),
                orderNo: search.find('[submit=orderNo]').getVal(),
                saleOrderNo: search.find('[submit=saleOrderNo]').getVal(),
                outSysNo: search.find('[submit=saleOrderNo]').getVal(),
                orderStatus: self.OrderStatus,
                startCreateTime: search.find('[submit=startCreateTime]').getVal(),
                endCreateTime: search.find('[submit=endCreateTime]').getVal(),
                startTime: search.find('[submit=startTime]').getVal(),
                endTime: search.find('[submit=endTime]').getVal(),
                hotelName: search.find('[submit=hotelName]').getVal(),
                purMobile: search.find('[submit=purLinkman]').getVal(),//purMobile,purLinkman
                cusMobile: search.find('[submit=cusLinkman]').getVal(),//cusLinkman
                userType: self.userType
            });
        },
        //查询
        searchList: function () {
            var self = this
                , template = ''
                , listData = {}
                , deferred = $.Deferred()
                , $personalOrderBadge = $('.js-personal-number')
                , $companyOrderBadge = $('.js-company-number');
            self.getAdvanceSearchParam();
            util.postRsp(self.api.index, self.queryParams, function (rsp) {
                //self.OrderStatusObj = rsp['data']['OrderStatus'];
                self.dataList = rsp['data']['dataList'];
                self.data = rsp['data'];
                template += '' +
                '<thead>' +
                '   <tr>' +
//                '       <th><input type="checkbox" id="all" class="js-checkbox-all" name="all"></th>' +
                '		<th width="30"><label class="checkbox"><input type="checkbox" class="input-checkbox js-checkbox-all" name="all"></label></th>'+
                '       <th>酒店名称</th>' +
                '       <th>预订房型</th>' +
                '       <th>入离日期</th>' +
                /*'       <th style="width:90px">终端</th>' +
                '       <th>联系人信息</th>' +*/
                '       <th style="width:120px">订单总额</th>' +
                '       <th style="width: 90px">';
                if (self.isNavStatusAll) {
                    template += '' +
                    '           <div class="option input-icon js-option-order-status">' +
                        //TODO 下拉菜单
                    '               <input class="input-text" type="text" data-id="'+self.OrderStatus+'" value="'+(self.OrderStatusObj[self.OrderStatus] || '全部订单')+'" readonly="readonly">' +
                    '               <div class="btn-group">' +
                    '                   <i class="icon-font icon-arrow-down"></i>' +
                    '               </div>' +
                    '               <ul class="option-list" style="display: none;">';
                    template += '<li data-id="ALL">全部订单</li>';
                    for (var attr in self.OrderStatusObj) {
                        template += '<li data-id="' + attr + '">' + self.OrderStatusObj[attr] + '</li>';
                    }
                    template +=
                        '               </ul>' +
                        '           </div>';
                } else {
                    template += '订单状态';
                }
                template += '' +
                '       </th>' +
                '       <th style="width:120px">操作</th>' +
                '       <th style="width:120px">备注</th>' +
                '   </tr>' +
                '</thead>' +
                '<tbody class="js-hotel-list">';
                if (self.dataList.length) {
                    for (var i = 0; i < self.dataList.length; i++) {
                        listData = self.dataList[i];
                        var outSysOrderStatus = '<span style="color:#FF0000">（'+ listData['outSysOrderStatus'] +'）</span>';
                        template += '' +
                        '<tr class="table-gray">' +
                        '    <td colspan="8">' +
                        '        <ul class="clearfix">' +
                        '			 <li style="float:left; padding-right:10px;"><label class="checkbox"><input type="checkbox" id="orderId" class="input-checkbox js-checkbox" name="orderId" value="'+ listData['orderId'] +'"></label></li>'+
                        '            <li style="float:left; padding-right:10px;">订单编号：' + listData['orderNo'] + (listData['isRefund'] ? "<span data-orderno='"+listData["orderNo"]+"' style='margin: 0 4px;' class='js-hotel-refund pane-blue pane-min-padding'>退</span>" : "") + (listData['outSysOrderStatus'] === "" ? "" : outSysOrderStatus) +'</li>' +
                        '            <li style="float:left; padding-right:10px;">下单时间：' + listData['createTime']+ '</li>' +
                        '            <li style="float:left; padding-right:10px;">终端：' + listData['orderSource'] + '</li>' +
                        '            <li style="float:left; padding-right:10px;">采购会员：' + (listData['purLinkman'] === listData['purMobile']?'':listData['purLinkman']) + '&nbsp;' + listData['purMobile'] + '</li>' +
                        '            <li style="float:left;">住客联系人：' + (listData['cusLinkman'] === listData['cusMobile']?'':listData['cusLinkman']) + ' &nbsp;' + listData['cusMobile'] + '</li>' +
                        '        </ul>' +
                        '    </td>' +
                        '</tr>' +
                        '<tr data-order-id="' + listData['orderId'] + '" data-version-no="' + listData['versionNo'] + '" data-order-status="' + listData['orderStatus'] + '">' +
//                        '    <td><label class="checkbox"><input type="checkbox" id="orderId" class="input-checkbox js-checkbox" name="orderId" value="'+ listData['orderId'] +'"></label></td>' +
                        '    <td colspan=2>' + listData['hotelName'] + '</td>' +
                        '    <td>' +
                        '        <p>' + listData['roomTypeName'] + '（' + listData['supplierName'] + '）</p>' +
//                        '        <p>标准双人房（慧旅供应商1）</p>' +
                        '    </td>' +
                        '    <td>' +
                        '        <p>' + listData['inDateAndOutDate'] + '</p>' +
//                        '        <p>' + listData['checkOutDate'] + '</p>' +
                        '    </td>' +
                        /*'    <td>' + listData['orderSource'] + '</td>' +*/
                       /* '    <td>' +
                        '        <p>采购联系人：' + listData['purLinkman'] + '</p>' +
                        '        <p>住客联系人：' + listData['cusLinkman'] + '</p>' +
                        '    </td>' +*/
                        '    <td><span class="c-orange">&yen;' + listData['amount'].toFixed(2) + '</span></td>' +
                        '    <td>' + listData['orderStatusName'] + '</td>' +
                        '    <td>';
                        if (listData['orderStatus'] == 'PAIED_ALL' && listData['orderStatus'] != 'REFUND_ALL' ) {
                            template += '' + '<a href="javascript:void(0);" class="js-hotel-index-refund-order">退订</a><br>';
                        }
                        if (listData['orderStatus'] == 'WAIT_PAY') {
                            template += '' + '<a href="javascript:void(0);" class="js-hotel-index-cancel-order">取消订单</a><br>';
                        }
                        template += '' +
                        '        <a href="javascript:void(0);" class="js-hotel-index-order-detail">查看订单详情</a>' +
                        '    </td>' +
                        '    <td>' + listData['remark'] + '</td>' +
                        '</tr>';
                    }
                } else {
                    template += '' +
                    '<tr><td colspan="8">找不到任何数据</td></tr>';
                }
                template += '' +
                '</tbody>';
                $('.js-hotel-table').html(template);
                self.loadPagination(rsp['data']);

                self.data['personalOrder'] > 0 ? $personalOrderBadge.show().text(self.data['personalOrder']) : $personalOrderBadge.hide().text('');
                self.data['companyOrder'] > 0 ? $companyOrderBadge.text(self.data['companyOrder']) : $companyOrderBadge.hide().text('');

                deferred.resolve();
            });
            return deferred;
        },
        loadPagination: function (pageModel) {
            var self = this;
            var totalPage = pageModel.totalCount
                , pageSize = pageModel.pageSize
                , currentPage = pageModel.currentPage;
            //加载翻页模块,handler:调用者对象,callback:回调方法
            getPage({
                cls: '.js-hotel-index-page',
                handler: self,
                totalPage: totalPage,
                pageSize: pageSize,
                currentPage: currentPage,
                pageList: [20, 30, 50, 100],
                callback: function (options) {
                    self.queryParams = $.extend(self.queryParams, options);
                    self.searchList();
                }
            });
        }
    };
    module.exports = hotelIndex;
});

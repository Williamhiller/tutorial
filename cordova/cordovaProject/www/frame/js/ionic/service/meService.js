/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module('me.service',[])
    .factory('RepaymentUtilService',['$q',function ($q) {
        var  DebxUtil = {
            debx : function (bidAmt,periodRate,period) {
                var debxBean = {};
                debxBean.debxTryBean = [];
                // 期利率 = 期利率% / 100
                var periodRate100 = periodRate / 100;
                // 每期还本付息金额（元）
                var repaymentAmt = parseFloat(DebxUtil.getRepaymentAmt(bidAmt, periodRate, period));
                // 还款总额（元）
                var totalAmt = DebxUtil.getTotalAmt(repaymentAmt, period).toFixed(2)-0;
                // 还款总利息（元）
                var totalInterestAmt = DebxUtil.getTotalInterestAmt(totalAmt, bidAmt);

                // 本息总额（元） 本金金额（元） 利息金额（元）
                var countRepaymentAmt = 0,countStillPrincipal = 0,countStillInterest = 0;
                // 剩余本金
                var countSurplusPrincipalAmt = bidAmt;

                for(var i=0;i<period;i++){
                    // 应收利息(元)
                    var still_interest = (countSurplusPrincipalAmt*periodRate100).toFixed(2)-0;
                    // 应收本金(元)
                    var still_principal = (repaymentAmt - still_interest).toFixed(2)-0;
                    // 剩余本金
                    countSurplusPrincipalAmt -= still_principal;
                    //
                    // // 第N期
                    var debxTryBean = {};
                    debxTryBean.repay_preiod = i + 1;// 还款期数

                    // 最后一期特殊处理
                    if (i == (period - 1)) {
                        debxTryBean.principal_amt = (bidAmt - countStillPrincipal).toFixed(2)-0;// 本金金额
                        debxTryBean.interest_amt = (totalInterestAmt - countStillInterest).toFixed(2)-0;// 利息金额
                        debxTryBean.total_amt = (totalAmt - countRepaymentAmt).toFixed(2)-0;// 本息总额
                        debxTryBean.complement_amt = 0;// 当期补差额
                        debxTryBean.rcv_repayment_amt = (totalAmt - countRepaymentAmt).toFixed(2)-0;// 应收还款总额
                        debxTryBean.surplus_principal_amt = 0; // 剩余本金
                    } else {
                        debxTryBean.principal_amt = still_principal;// 本金金额
                        debxTryBean.interest_amt = still_interest;// 利息金额
                        debxTryBean.total_amt = repaymentAmt.toFixed(2)-0;// 本息总额
                        debxTryBean.complement_amt = 0;// 当期补差额
                        debxTryBean.rcv_repayment_amt = repaymentAmt;// 应收还款总额
                        debxTryBean.surplus_principal_amt = countSurplusPrincipalAmt.toFixed(2)-0; // 剩余本金

                        countRepaymentAmt = (countRepaymentAmt + repaymentAmt).toFixed(2)-0;
                        countStillPrincipal = countStillPrincipal + still_principal;
                        countStillInterest = Number(countStillInterest) + Number(still_interest);
                    }
                    // 等额本息还款计划
                    debxBean.debxTryBean[i] = debxTryBean;
                    // 是否有效
                    debxBean.validFlag = true;
                }
                debxBean.periodRate = periodRate; // 期利率（%）
                debxBean.bidAmt = bidAmt; // 标的金额（元）
                debxBean.repaymentAmt = repaymentAmt; // 每期还本付息金额（元）
                debxBean.totalRepaymentAmt = totalAmt-0; // 还款本息总额（元）
                debxBean.totalInterestAmt = totalInterestAmt; // 还款总利息（元）

                return debxBean;
            },
            /**
             * 补差金额+合计值计算
             *
             * @param 等额本息Bean
             * @param 每期实际还本付息金额（元）
             * @param 实际应还款总额（元）
             * @param 是否需要补差额
             */
            supplementDigest : function (debxBean,repaymentAmt,realityTotalRepaymentAmt,complementFlag) {
                // 是否为有效计算
                if (debxBean != null && debxBean.validFlag) {

                    if (debxBean.debxTryBean != null && debxBean.debxTryBean.length > 0) {
                        /** 试算合计 */
                        var sumDebxTryBean = {};
                        sumDebxTryBean.principal_amt = 0;// 本金金额
                        sumDebxTryBean.interest_amt = 0;// 利息金额
                        sumDebxTryBean.total_amt = 0;// 本息总额
                        sumDebxTryBean.complement_amt = 0;// 当期补差额
                        sumDebxTryBean.rcv_repayment_amt = 0;// 应收还款总额

                        /** 补差总金额（元） */
                        var complementAmt = 0;
                        if (complementFlag && repaymentAmt != null) {
                            complementAmt = debxBean.totalRepaymentAmt - realityTotalRepaymentAmt;
                            debxBean.repaymentAmt = repaymentAmt; // 每期还本付息金额（元）
                        }

                        for (var i = 0; i < debxBean.debxTryBean.length;i++) {
                            var debxTryBean = debxBean.debxTryBean[i];

                            // 当期补差额
                            // var complementAmt = 0;
                            var periodComplementAmt = 0;

                            if (complementFlag && repaymentAmt != null) {
                                // 最后一期特殊处理
                                if (i == (debxBean.debxTryBean.length - 1)) {
                                    periodComplementAmt = complementAmt - sumDebxTryBean.complement_amt;
                                } else {
                                    periodComplementAmt = debxTryBean.total_amt - Math.abs(repaymentAmt);
                                }
                            }


                            debxTryBean.complement_amt = periodComplementAmt.toFixed(2)-0; // 当期补差额
                            debxTryBean.rcv_repayment_amt = debxTryBean.total_amt - periodComplementAmt; // 应收还款总额

                            sumDebxTryBean.principal_amt +=  debxTryBean.principal_amt;// 本金金额
                            sumDebxTryBean.interest_amt += debxTryBean.interest_amt;// 利息金额
                            sumDebxTryBean.total_amt = (sumDebxTryBean.total_amt + debxTryBean.total_amt).toFixed(2)-0;// 本息总额
                            sumDebxTryBean.complement_amt =(sumDebxTryBean.complement_amt + debxTryBean.complement_amt).toFixed(2)-0;// 当期补差额
                            sumDebxTryBean.rcv_repayment_amt +=  debxTryBean.rcv_repayment_amt;// 应收还款总额
                        }

                        debxBean.sumDebxTryBean = sumDebxTryBean;
                        debxBean.realityTotalRepaymentAmt = sumDebxTryBean.rcv_repayment_amt.toFixed(0)-0;// 实际应还款总额（元）（补差额后）
                        debxBean.totalInterestAmt = sumDebxTryBean.interest_amt;// 还款总利息（元）
                        debxBean.totalComplementAmt = sumDebxTryBean.complement_amt; // 补差总金额（元）
                    }
                }
            },
            getTermDays : function (startDate,endDate) {
                if(startDate == null || endDate == null){
                    return 0;
                }
                // 只截取年月日
                var startDateTrunc = new Date(startDate.replace(/-/g,'/'));
                var endDateTrunc = new Date(endDate.replace(/-/g,'/'));
                // 两日期之间相差天数
                var termDays = Math.abs(startDateTrunc.getTime() - endDateTrunc.getTime())/1000/60/60/24;

                return parseInt(termDays);
            },
            getMonthRate : function (yearRate){
                return yearRate / 12;
            },
            getDayRate : function (yearRate){
                // 日利率% = 年利率% / 365
                return yearRate / 365;
            },
            getPeriodRate : function (yearRate,period,termDays){
                // 期利率% = 日利率% * 分期期限 / 分期期数
                return DebxUtil.getDayRate(yearRate) * termDays / period;
            },
            getRepaymentAmt : function (bidAmt,periodRate,period){
                // 期利率
                var periodRate100 = periodRate / 100;
                // 每期还本付息金额(应收本息) ＝ 分期金额 × 期利率 ×（1＋期利率）^n期÷〔（1＋期利率）^n期－1〕
                var repaymentAmt = (bidAmt * periodRate100 * Math.pow((periodRate100 + 1), period)) / (Math.pow((periodRate100 + 1), period) - 1);

                return repaymentAmt;
            },
            getTotalAmt : function (repaymentAmt,period) {
                // 还款总额(元)
                var totalAmt = repaymentAmt * period;
                return totalAmt;
            },
            getTotalInterestAmt : function (totalAmt,bidAmt) {
                // 还款总利息(元)
                var totalInterestAmt = totalAmt-bidAmt;

                return totalInterestAmt;
            },
            getBidAmt : function (repaymentAmt,periodRate,period) {
                // 期利率
                var periodRate100 = periodRate / 100;
                // 标的金额 ＝ 每期还本付息金额（元）*〔（1＋期利率）^n期－1〕÷ 期利率 ×（1＋期利率）^n期
                var bidAmt = (repaymentAmt * (Math.pow((periodRate100 + 1), period) - 1)) / (periodRate100 * Math.pow((periodRate100 + 1), period));

                return bidAmt;
            }
        };
        return {
            /**
             * 租房类-客户承担
             * @param 分期期限（天）
             * @param 月租金额（元）
             * @param 个人融资成本年利率（%）
             * @param 分期期数
             * @param 是否需要补差额
             */
            rentingByCustomer : function (startDate,endDate,monthlyAmt,yearRate,period,complementFlag) {
                var deffered = $q.defer();
                var termDays = DebxUtil.getTermDays(startDate,endDate)
                // 期利率
                var periodRate = DebxUtil.getPeriodRate(yearRate, period, termDays);
                // // 标的金额（元）（四舍五入取整）
                var bidAmt = Math.round(monthlyAmt * period);
                // /** 等额本息（核心算法） */
                var debxBean = DebxUtil.debx(bidAmt, periodRate, period);
                // // 分期期限（天）
                debxBean.termDays = termDays;
                // /** 合计值计算+补差金额 */
                DebxUtil.supplementDigest(debxBean,debxBean.repaymentAmt,debxBean.totalRepaymentAmt, complementFlag);
                deffered.resolve(debxBean);

                return deffered.promise;

            },
            /**
             * 租房类-商户承担
             *
             * @param 分期期限（天）
             * @param 月租金额（元）
             * @param 标的发标年利率（%）
             * @param 分期期数
             * @param 是否需要补差额
             */
            rentingByMerchant : function (startDate,endDate,monthlyAmt,yearRate,period,complementFlag) {
                var deffered = $q.defer();
                var termDays = DebxUtil.getTermDays(startDate,endDate)
                // 期利率
                var periodRate = DebxUtil.getPeriodRate(yearRate, period, termDays);

                // 标的金额（元）（向上舍取整）
                var bidAmt = Math.ceil(Math.abs(monthlyAmt) * period);

                // 订单总金额（元）
                var orderTotalAmt = Math.ceil(monthlyAmt * period);

                /** 等额本息（核心算法） */
                var debxBean = DebxUtil.debx(bidAmt, periodRate, period);

                // 分期期限（天）
                debxBean.termDays = termDays;
                /** 合计值计算+补差金额 */
                DebxUtil.supplementDigest(debxBean, Math.abs(monthlyAmt),orderTotalAmt, complementFlag);
                deffered.resolve(debxBean);
                return deffered.promise;
            },
            /**
             * 服务类-客户承担
             * @param 起息日
             * @param 分期期限（天）
             * @param 订单金额（元）
             * @param 个人融资成本年利率（%）
             * @param 分期期数
             * @param 是否需要补差额
             */
            serviceByCustomer : function (startDate,endDate,orderAmt,yearRate,period,complementFlag) {
                var deffered = $q.defer();
                var termDays = DebxUtil.getTermDays(startDate,endDate)
                // 期利率
                var periodRate = DebxUtil.getPeriodRate(yearRate, period, termDays);

                // 每期间隔天数
                var intervalDay = Math.floor(termDays / period);

                if (intervalDay <= 1) {
                    validateService.showError( "每期间隔天数必须大于1天");
                }
                // 标的金额（元）（四舍五入取整）
                var bidAmt = Math.round(Math.abs(orderAmt));

                /** 等额本息（核心算法） */
                var debxBean = DebxUtil.debx(bidAmt, periodRate, period);

                // 分期期限（天）
                debxBean.termDays = termDays;
                debxBean.intervalDay = intervalDay;
                /** 合计值计算+补差金额 */
                DebxUtil.supplementDigest(debxBean, debxBean.repaymentAmt,debxBean.totalRepaymentAmt, complementFlag);
                deffered.resolve(debxBean);
                return deffered.promise;
            },
            /**
             * 服务类-商户承担
             * @param 分期期限（天）
             * @param 订单金额（元）
             * @param 标的发标年利率（%）
             * @param 分期期数
             * @param 是否需要补差额
             */
            serviceByMerchant : function (startDate,endDate,orderAmt,yearRate,period,complementFlag) {
                var deffered = $q.defer();
                var termDays = DebxUtil.getTermDays(startDate,endDate)
                // 期利率
                var periodRate = DebxUtil.getPeriodRate(yearRate, period, termDays);

                // 每期间隔天数
                var intervalDay = Math.floor(termDays / period);

                // 每期还本付息金额（元）
                var repaymentAmt = Math.ceil(Math.abs(orderAmt)/period*100)/100;
                // 标的金额（元）（四舍五入取整）
                var bidAmt = Math.ceil(DebxUtil.getBidAmt(repaymentAmt, periodRate, period));

                /** 等额本息（核心算法） */
                var debxBean = DebxUtil.debx(bidAmt, periodRate, period);
                // 分期期限（天）
                debxBean.termDays = termDays;
                debxBean.intervalDay = intervalDay;
                /** 合计值计算+补差金额 */
                DebxUtil.supplementDigest(debxBean, repaymentAmt,orderAmt, complementFlag);
                deffered.resolve(debxBean);
                return deffered.promise;
            }
        }
    }])
    .factory('RepaymentUtilInit',['RepaymentUtilService',function (RepaymentUtilService) {
        return {
            init : function (scope,item) {
                var data;
                !item ? data = scope.data:data = item;
                var startDate = data.sod_start_date, //开始分期日
                    endDate = data.sod_end_date,     //结束分期日
                    orderAmt = data.bod_total_amt,   //订单金额
                    yearRate = data.sod_financing_pcost, // 年利率
                    monthlyAmt = data.bod_rent_amt,     //月租
                    period = data.cod_apply_preiod,    //期数
                    complementFlag;
                try {
                    period?period = period:!scope.repay.preiod?period=data.sod_max_installment:period=scope.repay.preiod;
                }catch (err){
                    period?period = period:period=data.sod_max_installment;
                }
                if(data.sod_industry_type.substr(7,1)==1){ //租房类

                    if(data.bod_paying_party == '204700000001'){  //个人承担
                        complementFlag = false;
                        // console.log(startDate,endDate,monthlyAmt,yearRate,period,complementFlag,'租房')
                        var debxBean = RepaymentUtilService.rentingByCustomer(startDate,endDate,monthlyAmt,yearRate,period,complementFlag);
                        debxBean.then(function (res) {
                            data.sod_total_interest = res.totalInterestAmt;
                            data.sod_total_amt = res.totalRepaymentAmt;
                            data.sod_repayment_amt = res.debxTryBean[0].rcv_repayment_amt;
                            // console.log(res)
                        })
                    }else if(data.bod_paying_party == '204700000002'){ //商户承担
                        complementFlag = true;
                        yearRate = data.sod_financing_mcost;
                        // console.log(startDate,endDate,monthlyAmt,yearRate,period,complementFlag,'租房')
                        var debxBean = RepaymentUtilService.rentingByMerchant(startDate,endDate,monthlyAmt,yearRate,period,complementFlag);
                        debxBean.then(function (res) {
                            data.sod_total_interest = res.totalInterestAmt;
                            data.sod_total_amt = data.bod_total_amt;
                            data.sod_repayment_amt = res.debxTryBean[0].rcv_repayment_amt;
                            // console.log(data)
                        })
                    }
                }else if(data.sod_industry_type.substr(7,1)==2){ //金融类
                    if(data.bod_paying_party == '204700000001'){  //个人承担
                        complementFlag = false;
                        // console.log(startDate,endDate,orderAmt,yearRate,period,complementFlag,'金融')
                        var debxBean = RepaymentUtilService.serviceByCustomer(startDate,endDate,orderAmt,yearRate,period,complementFlag);
                        debxBean.then(function (res) {
                            data.sod_total_interest = res.totalInterestAmt;
                            data.sod_total_amt = res.totalRepaymentAmt;
                            data.sod_repayment_amt = res.debxTryBean[0].rcv_repayment_amt;
                            // console.log(res)
                        })
                    }else if(data.bod_paying_party == '204700000002'){ //商户承担
                        complementFlag = true;
                        yearRate = data.sod_financing_mcost;
                        // console.log(startDate,endDate,orderAmt,yearRate,period,complementFlag,'金融')
                        var debxBean = RepaymentUtilService.serviceByMerchant(startDate,endDate,orderAmt,yearRate,period,complementFlag);
                        debxBean.then(function (res) {
                            data.sod_total_interest = res.totalInterestAmt;
                            data.sod_total_amt = data.bod_total_amt;
                            data.sod_repayment_amt = res.debxTryBean[0].rcv_repayment_amt;
                            // console.log(data)
                            // console.log(res)
                        })
                    }
                }
                return data;
            }
        }
    }]);


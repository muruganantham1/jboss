/*
 * Copyright (C) 2012  Krawler Information Systems Pvt Ltd
 * All rights reserved.
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
var userTabs = [];
var projectTabs = [];
var mainPanel;
var deskeraAdmin = false;
var numTabs = 1;
var companyName = "";
var pagebaseURL ="";
Wtf.CompanyName=" ";
Wtf.DemoCompanyId="a4792363-b0e1-4b67-992b-2851234d5ea6";                       // Used for disabling role edit for demo company
Wtf.CurrencySymbol = "\u0024";

if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment){
    Range.prototype.createContextualFragment = function(html)
    {
        var frag = document.createDocumentFragment(),
        div = document.createElement("div");
        frag.appendChild(div);
        div.outerHTML = html;
        return frag;
    };
}

Wtf.ux.ContentPanel = function(config){
    Wtf.apply(this, config);
    Wtf.ux.ContentPanel.superclass.constructor.call(this, config);
};
Wtf.extend(Wtf.ux.ContentPanel, Wtf.Panel, {
    closable: true,
    autoScroll: true
});
Wtf.ux.MainPanel = function(config){
    Wtf.ux.MainPanel.superclass.constructor.call(this, config);
};
Wtf.extend(Wtf.ux.MainPanel, Wtf.TabPanel, {
    loadTab: function(href, id, tabtitle, navAreaid, tabtype, queue, activesubtab,closable){
        var tabid = "tab" + id.substr(3);
        var tab = this.getComponent(tabid);
        if (tab) {
            this.setActiveTab(tab);
            if(activesubtab) {
                tab.activesubtab = activesubtab;
                if(tab.tabType == Wtf.etype.proj){
                    if(typeof activesubtab == "string")
                        Wtf.getCmp("projectTabs_"+tab.id.substr(3)).pro.fireEvent(activesubtab);
                    else
                        Wtf.getCmp("projectTabs_"+tab.id.substr(3)).pro.fireEvent(activesubtab.event);
                }
                if(tabid == "tabcompanyadminpanel"){
                    Wtf.getCmp("mainAdmin").fireEvent(activesubtab);
                }
            }
        }
        else {
            if(href == "project.html" && Wtf.subscription.cal && !calLoad)
                WtfGlobal.loadScript("scripts/minified/calendar.js?v=19");
            var autoload = {
                tabid: tabid,
                url: href,
                scripts: true
            };
            var p = new Wtf.ux.ContentPanel({
                id: tabid,
                title: tabtitle,
                autoLoad: autoload,
                navarea: navAreaid,
                layout: 'fit',
                tabType: tabtype,
                closable: closable != null ? closable : true,
                iconCls: getTabIconCls(tabtype)
            });

            if (queue) {
                switch (tabtype) {
                    case Wtf.etype.comm:
                        communityTabs.push(p);
                        break;
                    case Wtf.etype.proj:
                        projectTabs.push(p);
                        break;
                    case Wtf.etype.user:
                        userTabs.push(p);
                        break;
                    case Wtf.etype.lms:
                        courseTabs.push(p);
                        break;
                    case Wtf.etype.acc:
                        accountingTabs.push(p);
                        break;
                }
            }
            this.add(p);
            this.setActiveTab(p);
            if(activesubtab){
                p.activesubtab = activesubtab;
            }
            Wtf.getCmp(tabid).on("hide", function() {
                var expandWin = Wtf.getCmp('Expand');
                if(expandWin != undefined)
                    expandWin.hide();
            }, this);
        }
    }
});

function getTabIconCls(tabtype){
    switch (tabtype) {

        case Wtf.etype.hrmsdocuments:
            return "pwndCommon documenttabIcon";
            break;
        case Wtf.etype.hrmsapplicantlist:
            return "pwndHRMS applicanttabIcon";
            break;
        case Wtf.etype.hrmsemployeelist:
            return "hrmsemployeelistTabIcon";
            break;
        case Wtf.etype.hrmsdocument:
            return "pwndCommon documenttabIcon";
            break;
        case Wtf.etype.hrmsqualification:
            return "pwndHRMS qualificationtabIcon";
            break;
        case Wtf.etype.hrmsorganization:
            return "pwndHRMS organizationtabIcon";
            break;
        case Wtf.etype.hrmscontactinfo:
            return "pwndHRMS contactdetailstabIcon";
            break;
        case Wtf.etype.hrmspersonaldata:
            return "pwndHRMS personaldetailstabIcon";
            break;
        case Wtf.etype.hrmsemployeeprofile:
            return "pwndCommon profiletabIcon";
            break;
        case Wtf.etype.hrmsprofile:
            return "pwndCommon profiletabIcon";
            break;
        case Wtf.etype.hrmsmygoals:
            return "pwndCommon profile2tabIcon";
            break;
        case Wtf.etype.hrmsarchive:
            return "pwndCommon archivetabIcon";
            break;
        case Wtf.etype.hrmsinitapp:
            return "pwndHRMS initiatetabIcon";
            break;
        case Wtf.etype.hrmsrecruitment:
            return "pwndHRMS recruitmanagetabIcon";
            break;
        case Wtf.etype.jobsearch:
            return "jobsearchTabIcon";
            break;
        case Wtf.etype.hrmsjobexternal:
            return "pwndHRMS viewtabIcon";
            break;
        case Wtf.etype.hrmsprofile:
            return "pwndCommon profiletabIcon";
            break;
        case Wtf.etype.hrmsprospect:
            return "hrmsprospectTabIcon";
            break;
        case Wtf.etype.hrmsprofile:
            return "pwndCommon profiletabIcon";
            break;
        case Wtf.etype.hrmsrec:
            return "pwndHRMS recruitertabIcon";
            break;
        case Wtf.etype.hrmsassignjobs:
            return "pwndHRMS addjobstabIcon";
            break;
        case Wtf.etype.hrmspreinternal:
            return "hrmspreinternalTabIcon";
            break;
        case Wtf.etype.hrmsviewapp:
            return "pwndHRMS selectedapptabIcon";
            break;
        case Wtf.etype.hrmsviewrec:
            return "hrmsviewrecTabIcon";
            break;
        case Wtf.etype.hrmspreexternal:
            return "hrmspreexternalTabIcon";
            break;
        case Wtf.etype.hrmsviewtimesheet:
            return "pwndHRMS timesheettabIcon";
            break;
        case Wtf.etype.hrmsmygoals:
            return "pwndCommon profile2tabIcon";
            break;
        case Wtf.etype.hrmskey:
            return "hrmskeyTabIcon";
            break;
        case Wtf.etype.hrmstimesheet:
            return "pwndHRMS timesheettabIcon";
            break;
        case Wtf.etype.hrmsrecruit:
            return "pwndHRMS agencytabIcon";
            break;
        case Wtf.etype.hrmsinitapp:
            return "hrmsinitappTabIcon";
            break;
        case Wtf.etype.hrmsjobboard:
            return "pwndHRMS jobboardtabIcon";
            break;
        case Wtf.etype.hrmsinternaljob:
            return "hrmsinternaljobTabIcon";
            break;
        case Wtf.etype.hrmsexternaljob:
            return "pwndHRMS addjobstabIcon";
            break;
        case Wtf.etype.hrmsdesignation:
            return "pwndHRMS prerequisitetabIcon";
            break;
        case Wtf.etype.hrmscompetencymaster:
            return "pwndHRMS competencytabIcon";
            break;
        case Wtf.etype.hrmsinternalmanage:
            return "hrmsinternalmanageTabIcon";
            break;
        case Wtf.etype.hrmsinternaljobmanage:
            return "pwndHRMS managetabIcon";
            break;
        case Wtf.etype.hrmsexternalmanage:
            return "pwndHRMS managetabIcon";
            break;
        case Wtf.etype.hrmsrecruitmentagency:
            return "hrmsrecruitmentagencyTabIcon";
            break;
        case Wtf.etype.hrmsinternaljobboard:
            return "hrmsinternaljobboardTabIcon";
            break;
        case Wtf.etype.hrmsrecruiter:
            return "pwndHRMS recruitertabIcon";
            break;
        case Wtf.etype.hrmsmanageagency:
            return "pwndHRMS managetabIcon";
            break;
        case Wtf.etype.hrmsviewapps:
            return "pwndHRMS selectedapptabIcon";
            break;
        case Wtf.etype.hrmsaddapps:
            return "pwndHRMS pendingapptabIcon";
            break;
        case Wtf.etype.hrmsrejectapps:
            return "pwndHRMS rejectedapptabIcon";
            break;
        case Wtf.etype.hrmsform:
            return "hrmsformTabIcon";
            break;
        case Wtf.etype.hrmsinitiate:
            return "hrmsinitiateTabIcon";
            break;
        case Wtf.etype.hrmsappraisalform:
            return "pwndHRMS formtabIcon";
            break;
        case Wtf.etype.hrmsgoals:
            return "pwndCommon profiletabIcon";
            break;
        case Wtf.etype.hrmsmanagecompensation:
            return "pwndHRMS managetabIcon";
            break;
        case Wtf.etype.hrmscompensation:
            return "pwndHRMS compensationtabIcon";
            break;
        case Wtf.etype.hrmsreport:
            return "pwndCommon reporttabIcon";
            break;
        case Wtf.etype.hrmsperformance:
            return "pwndHRMS performancetabIcon";
            break;
        case Wtf.etype.hrmstime:
            return "pwndCommon timetabIcon";
            break;
        case Wtf.etype.hrmssuccession:
            return "hrmssuccessionTabIcon";
            break;
        case Wtf.etype.hrmsaudit:
            return "pwndCommon audittabIcon";
            break;
        case Wtf.etype.hrmsmaster:
            return "pwndHRMS configtabIcon";
            break;
        case Wtf.etype.hrms:
            return "hrmsTabIcon";
            break;
        case Wtf.etype.hrmssave:
            return "hrmssaveIcon";
            break;
        case Wtf.etype.home:
            return "pwndCommon dashboardTabIcon";
            break;
        case Wtf.etype.comm:
            return "pwnd communityTabIcon";
            break;
        case Wtf.etype.proj:
            return "pwnd projectTabIcon";
            break;
        case Wtf.etype.user:
            return "pwnd userTabIcon";
            break;
        case Wtf.etype.docs:
            return "pwnd doctabicon";
            break;
        case Wtf.etype.cal:
            return "pwnd teamcal";
            break;
        case Wtf.etype.forum:
            return "pwnd communitydiscuss";
            break;
        case Wtf.etype.pmessage:
            return "pwnd pmsgicon";
            break;
        case Wtf.etype.pplan:
            return "pwnd projplan";
            break;
        case Wtf.etype.adminpanel:
            return "pwnd admintab";
            break;
        case Wtf.etype.adminpanel2:
            return "pwndcommon mastertabIcon";
            break;
        case Wtf.etype.todo:
            return "pwnd todolistpane";
            break;
        case Wtf.etype.search:
            return "pwnd searchtabpane";
            break;
        case Wtf.etype.accreports:
            return " pwnd accreportsTabIcon";
            break;
        case Wtf.etype.master:
            return "pwndHRMS payrollcompotabIcon";
            break;
        case Wtf.etype.acc:
            return "pwndCommon templatetabIcon";
            break;
        case Wtf.etype.acccustomer:
            return "pwndCommon profiletabIcon";
            break;
        case Wtf.etype.payroll:
            return "pwndHRMS payrollmanagetabIcon";
            break;
        case Wtf.etype.contacts:
            return "pwnd contactsTabIcon";
            break;
        case Wtf.etype.crm:
            return "pwndCommon reporttabIcon";
            break;
        case Wtf.etype.hrmssalaryreport:
            return "pwndHRMS salaryreporttabIcon";
            break;
        case Wtf.etype.hrmsmypayslip:
            return "pwndHRMS mypaysliptabIcon";
            break;
        case Wtf.etype.hrmsreview:
            return "pwndHRMS reviewtabIcon";
            break;
        case Wtf.etype.hrmsappraisalreport:
            return "pwndHRMS appraisalreporttabIcon";
            break;
        case Wtf.etype.hrmsmyappraisalreport:
            return "pwndHRMS myappraisalreporttabIcon";
            break;
    }
}

function getButtonIconCls(buttontype){
    switch (buttontype) {
        case Wtf.btype.addbutton:
            return "pwndCommon addbuttonIcon";
            break;
        case Wtf.btype.editbutton:
            return "pwndCommon editbuttonIcon";
            break;
        case Wtf.btype.viewbutton:
            return "pwndHRMS viewbuttonIcon";
            break;
        case Wtf.btype.deletebutton:
            return "pwndCommon deletebuttonIcon";
            break;
        case Wtf.btype.assignbutton:
            return "pwndHRMS assignbuttonIcon";
            break;
        case Wtf.btype.cancelbutton:
            return "pwndCommon cancelbuttonIcon";
            break;
        case Wtf.btype.documentbutton:
            return "pwndCommon docuploadbuttonIcon";
            break;
        case Wtf.btype.submitbutton:
            return "pwndCommon submitbuttonIcon";
            break;
        case Wtf.btype.downloadbutton:
            return "pwndCommon docdownloadbuttonIcon";
            break;
        case Wtf.btype.reportbutton:
            return "pwndCommon reportbuttonIcon";
            break;
        case Wtf.btype.winicon:
            return "pwndCommon iconwin";
            break;
        case Wtf.btype.emailbutton:
            return "pwndCommon emailbuttonIcon";
            break;
        case Wtf.btype.upbutton:
            return "pwndHRMS upbuttonIcon";
            break;
        case Wtf.btype.downbutton:
            return "pwndHRMS downbuttonIcon";
            break;
        case Wtf.btype.setmasterbutton:
            return "pwndHRMS setmasterbuttonIcon";
            break;
        case Wtf.btype.docbutton:
            return "pwndCommon documentButIcon";
            break;
    }
}

Wtf.onReady(function(){
    validateServerSession();
    mainPanel = new Wtf.ux.MainPanel({
        id: 'as',
        region: 'center',
        deferredRender: false,
        resizeTabs: true,
        minTabWidth: 185,
        loadMask: new Wtf.LoadMask(document.body, Wtf.apply(this.loadMask)),
        cls: 'ascls',
        titleCollapse: true,
        activeTab: 0,
        enableTabScroll: true,
        items: [new Wtf.ux.ContentPanel({
            id: "tabdashboard",
            title: "Dashboard",
            navarea: "navareadashboard",
            closable:false,
            layout : "fit",
            autoLoad: {
              	url: 'dashboard-EPF.html',//Wtf.req.base + 'dashboard.jsp?refresh=false',
                scripts: true
            },
            iconCls: getTabIconCls(Wtf.etype.home),
            tabType: Wtf.etype.home
        })]
    });
    Wtf.getCmp("tabdashboard").on("activate", function(){
        if(bHasChanged){
            Wtf.getCmp("tabdashboard").load({
                url: Wtf.req.base + "dashboard.jsp?refresh=true",
                scripts: true
            });
            bHasChanged=false;
        }
    }, this);
    var viewport = new Wtf.Viewport({
        layout: 'border',
        items: [new Wtf.BoxComponent({
            region: 'north',
            el: "header"
        }), mainPanel]

    });
    viewport.doLayout();
    Wtf.useShims = true;
    Wtf.QuickTips.init();
    Wtf.apply(Wtf.QuickTips.getQuickTip(), {
        dismissDelay:0
    });
});

function setUsername(uName,loginname){
    var _uElem = document.getElementById('whoami');
    _uElem.innerText = uName; //mofo IE
    _uElem.textContent = uName;
    if(loginname=='demo'){
        addToXCuts("#", "Sign Up", "loadSignupPage()",'0',"Love Deskera? Let us know by signing up! Special offers waiting for you.");
    }
}

function otherLinks(subdomain){
	addToXCuts("mailto:"+subdomain+"@deskera.com", "Support", "",'0',"Need more help? Send us an E-mail and we will help resolve any queries you have.");
    addToXCuts("http://forum.deskera.com/", "Forum", "",'0',"Visit the Deskera Forum and tell us what is on your mind. Your feedback is very valuable.");
    addToXCuts("http://blog.deskera.com/", "Blog", "",'0',"Visit the Blog for Deskera HRMS for news and updates.");
    addToXCuts("http://support.deskera.com/index.php/Deskera_HRMS_Help", "Help", "",'1',"Visit Deskera HRMS Support page for more help.");
}

function updatePreferences(){
    Wtf.Ajax.requestEx({
        url: Wtf.req.base + 'UserManager.jsp',
        params: {
            mode:31
        }
    }, this,
    function(result, req){
        if(result) Wtf.pref = eval(result.data)[0];
    });
}

function loadAdminPage(id){
    var ev = "adminclicked";
    switch(id) {
        case "1":
            ev = "adminclicked";
            break;
        case 1:
            ev = "adminclicked";
            break;
        case "2":
            ev = "masterclicked";
            break;
        case 2:
            ev = "masterclicked";
            break;
        case "3":
            ev = "companyclicked";
            break;
        case 3:
            ev = "companyclicked";
            break;
        case "4":
            ev = "featureclicked";
            break;
        case 4:
            ev = "featureclicked";
            break;
    }
    mainPanel.loadTab("admin.html", "   companyadminpanel", "<div wtf:qtip='Manage all the details of people in your organization, configure the settings related to the work structure and also keep a track of all activities.'>Administration</div>", "navareadashboard", Wtf.etype.adminpanel,false,ev);
}

function loadEPFPage(){
    var tipTitle="EPF Service";
    var title = Wtf.util.Format.ellipsis(tipTitle,18);
    title = "<div wtf:qtip=\""+tipTitle+"\"wtf:qtitle='EPF Service'>"+title+"</div>";
    mainPanel.loadTab('payrollSummary.html', 'navsunrisecalibar', title,'navareasunrisecalibar', 15, false,false,true);
}

function loadEPFPayment(rec,amount){
    var ApplyLeave=new Wtf.leavem.PaymentDetails({
                width:375,
                modal:true,
		height:430,
                resizable:false,
		listType:'New',
                rec:rec,
                amount:amount,
//		iconCls : getTabIconCls(Wtf.etype.iconwin),
		title:"Payment Details",
		leaverec:null,
		leaveid:null,
		userid: "",
		isgroup: false,
                layout:'fit'
        });
     ApplyLeave.show();
}
function confirmpayment(amount,isMayBank){
    var getconfwindow=new Wtf.leavem.PaymentConf({
            width:500,
            modal:true,
            height:330,
            amount:amount,
            resizable:false,
            listType:'New',
            isMayBank:isMayBank,
            iconCls : getTabIconCls(Wtf.etype.iconwin),
            title:"Payment Confirmation",
            leaverec:null,
            leaveid:null,
            userid:"",
            layout:'fit'
         });
    getconfwindow.show();

}

function maybankloginwindow(amount){
    var getconfwindow=new Wtf.leavem.maybankloginwindow({
            width:375,
            modal:true,
            height:450,
            id:'maybankloginwindow_id',
            amount:amount,
            resizable:false,
            listType:'New',
            iconCls : getTabIconCls(Wtf.etype.iconwin),
            title:"maybank2u.com",
            leaverec:null,
            leaveid:null,
            userid:"",
            layout:'fit'
         });
    getconfwindow.show();

}

function confirmationsuccess(madeto,amt){
 var getconfwindow=new Wtf.leavem.PaymentSucces({
            width:500,
            madeto:madeto,
            amtval:amt,
            modal:true,
            height:300,
            resizable:false,
            listType:'New',
            iconCls : getTabIconCls(Wtf.etype.iconwin),
            title:"Congratulations",
            leaverec:null,
            leaveid:null,
            userid:"",
            layout:'fit'
         });
    getconfwindow.show();
}

function confirmationsuccessOnlinePay(madeto,amt){
 var getconfwindow=new Wtf.leavem.onlinebankPaySucces({
            width:500,
            madeto:madeto,
            amtval:amt,
            modal:true,
            height:450,
//            resizable:false,
            listType:'New',
            iconCls : getTabIconCls(Wtf.etype.iconwin),
            title:"maybank2u.com",
            leaverec:null,
            leaveid:null,
            userid:"",
            layout:'fit',
            confirmFlag:1
         });
    getconfwindow.show();
}

function viewepfsheet(rec,myrec,amnt){
    var viewepf=new Wtf.leavem.EpfSheet({
        width:400,
        modal:true,
		height:550,
                resizable:false,
		listType:'New',
		iconCls : getTabIconCls(Wtf.etype.iconwin),
		title:"EPF Sheet",
		leaverec:null,
		leaveid:null,
		userid: "",
                rec:rec,
                myrec:myrec,
                amnt:amnt,
		isgroup: false,
                layout:'fit'
        });
     viewepf.show();
}

function viewCompanysheet(){
     Wtf.Ajax.requestEx({
            method: "POST",
            url:"Payroll/Wage/getCompanyDetail.py",
            params: {
                mode: 1
            }
        },
        this,
        function(result, request){
            try {
                var data = result;
                if (data) {
                    createcompanyform(data.data[0]);
                }
            }
            catch (e) {

            }
        },
        function(){
            Wtf.MessageBox.Show({
                title: 'Error',
                msg:  "Error occured while retriving information.",
                buttons: Wtf.MessageBox.OK,
                icon: Wtf.MessageBox.INFO
            });
        }
        );
    
}
function  createcompanyform(rec){
     var viewComp=new Wtf.leavem.CompanySheet({
        width:400,
        modal:true,
		height:350,
                resizable:false,
		listType:'New',
                myrec:rec,
               iconCls : getTabIconCls(Wtf.etype.iconwin),
		title:"Company Details",
		leaverec:null,
		leaveid:null,
		userid: "",
		isgroup: false,
                layout:'fit'
     });
     viewComp.show();
}
function ConfigMaster(){
    var mainTabId = Wtf.getCmp("as");
    var projectBudget = Wtf.getCmp("masterConfigTab");
    if(projectBudget == null){
        projectBudget = new Wtf.MasterConfigurator({
            layout:"fit",
            title:"Master Configuration",
            closable:true,
            border:false,
            id:"masterConfigTab",
            iconCls:getTabIconCls(Wtf.etype.hrmsmaster)
        });
        mainTabId.add(projectBudget);
    }
    mainTabId.setActiveTab(projectBudget);
    mainTabId.doLayout();
}

function ConfigAppraisalCycleMaster(){
    var mainTabId = Wtf.getCmp("as");
    var projectBudget = Wtf.getCmp("AppraisalCycleConfigTab");
    if(projectBudget == null){
        projectBudget = new Wtf.appraisalCycleMasterGrid({
            layout:"fit",
            title:"Set Appraisal Cycle",
            closable:true,
            border:false,
            id:"AppraisalCycleConfigTab",
            iconCls:getTabIconCls(Wtf.etype.hrmsmaster)
        });
        mainTabId.add(projectBudget);
    }
    mainTabId.setActiveTab(projectBudget);
    mainTabId.doLayout();
}

function signOut(type){
    var _out = "";
    if(type !== undefined && typeof type != "object")
        _out = "?type="+type;
    _dC('lastlogin');
    _dC('featureaccess');
    _dC('username');
    _dC('lid');
    _dC('companyid');
    var m = Wtf.DomainPatt.exec(window.location);
    var _u = 'error.dsh';
    if (type == "noaccess" || type == "alreadyloggedin") {
		_u += '?e=' + type;
		if(m && m[1]){
			_u += '&n=' + m[1];
		}
    }
    else {
		
        	_u = 'b/' + 'hrms' + '/signOut.dsh' + _out;
		
    }
    //alert(window.top.location.href);
    _u = window.location.origin +'/hrms/'+ _u;
    _r(_u);
}

function _dC(n){
    document.cookie = n + "=" + ";path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

function getPermissionObjects(permobj){
    var wrapobj = permobj;
    if(wrapobj.Perm){
        Wtf.Perm = wrapobj.Perm;
    }
    if(wrapobj.UPerm){
        Wtf.UPerm = wrapobj.UPerm;
    }
    if(wrapobj.deskeraadmin){
        deskeraAdmin = true;
    }
    if(wrapobj.hrms_modules){
        Wtf.cmpPerm= wrapobj.hrms_modules;
        for(var i=0;i<Wtf.cmpPerm.data.length;i++){
            Wtf[Wtf.cmpPerm.data[i].modulename]=Wtf.cmpPerm.data[i].moduleid;
        }
    }
}

function validateServerSession(){
    Wtf.Ajax.requestEx({
//        url: 'jspfiles/validate.jsp',
        url:"AuthHandler/verifyLogin.common",
        params: {
            blank: -1
        }
    }, this,
    function(result, req){
        var res = eval("(" + result + ")");
        getPermissionObjects(res.perm);
        if (res) {
			if (!deskeraAdmin) {
				setUsername(res.fullname, res.username);
				otherLinks(res.subdomain);
				Wtf.pref = eval(res.preferences);
                Wtf.cmpPref=res.companypreferences[0];
				loginid = res.lid;
                userroleid=res.roleid;
				loginname = res.username;
				companyid = res.companyid;
				companyName = res.company;
                Wtf.subCode=res.subscriptioncode;
				Wtf.CompanyName = res.company;
				pagebaseURL = res.base_url;
				document.getElementById('Deskerahrmstitle').text = companyName + " Workspace - HRMS";
//                                addRolePermlink();
                    }
			else {
				WtfGlobal.loadScript("scripts/minified/superUser.js");
				WtfGlobal.loadStyleSheet("style/companystat.css");
			}
		}
		else {
			signOut();
		}
    }, signOut);
}

function addToXCuts(u, t, eh, no, tip){
	if(no==0)
		Wtf.DomHelper.append('shortcuts','<a ' + (eh ? ('onclick="' + eh) : ('target="_blank')) + '" href="' + u + '" wtf:qtip=\'' + tip+ '\'>' + t + '</a> | ');
	else
		Wtf.DomHelper.append('shortcuts','<a ' + (eh ? ('onclick="' + eh) : ('target="_blank')) + '" href="' + u + '" wtf:qtip=\'' + tip+ '\'>' + t + '</a>');
}

function showPersnProfile(){
    var p = Wtf.getCmp("updateProfileWin");
    if(!p){
        new Wtf.common.UpdateProfile({}).show();
    }
}

function changepass(){
    this.changepasswin=new Wtf.passwin({
        title:'Change Password',
        width:390,
        iconCls:getButtonIconCls(Wtf.btype.winicon),
        modal:true,
        height:260,
        resizable:false,
        layout:'fit',
        profId:loginid
    }).show();
}

function addRolePermlink(){
    if(!WtfGlobal.EnableDisable(Wtf.UPerm.useradmin, Wtf.Perm.useradmin.assignperm)){
        Wtf.DomHelper.append('userinfo','&nbsp;&nbsp;<a onclick="requestPermissions();" href="#" wtf:qtip="Define access rights to the users i.e. what a particular user can / cannot do with the system depending on their roles and status in the organization.">Assign Role Permissions</a> ');
    }
}


function requestPermissions(){
    var permWindow=new Wtf.common.Permissions({
        title:"User Permissions",
        resizable: false,
        modal:true
    });
    permWindow.show();
}

function loadSignupPage(){
    signOut();
    window.location = 'http://www.deskera.com/hrms/pricing-and-signup'
}




Wtf.ux.Portal = Wtf.extend(Wtf.Panel, {
    layout: 'column',
    autoScroll: true,

    initComponent: function(){
        Wtf.ux.Portal.superclass.initComponent.call(this);
        this.addEvents({
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true,
            ondrag: true
        });
    },

    initEvents: function(){
        Wtf.ux.Portal.superclass.initEvents.call(this);
        this.dd = new Wtf.ux.Portal.DropZone(this, this.dropConfig);
    }
});
Wtf.reg('portal', Wtf.ux.Portal);

Wtf.ux.Portal.DropZone = function(portal, cfg){
    this.portal = portal;
    Wtf.dd.ScrollManager.register(portal.body);
    Wtf.ux.Portal.DropZone.superclass.constructor.call(this, portal.bwrap.dom, cfg);
    portal.body.ddScrollConfig = this.ddScrollConfig;
};

Wtf.extend(Wtf.ux.Portal.DropZone, Wtf.dd.DropTarget, {
    ddScrollConfig: {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },
    createEvent: function(dd, e, data, col, c, pos){
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    notifyOver: function(dd, e, data){

        var xy = e.getXY(), portal = this.portal, px = dd.proxy;
        // case column widths
        if (!this.grid) {
            this.grid = this.getGrid();
        }

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if (!this.lastCW) {
            this.lastCW = cw;
        }
        else
        if (this.lastCW != cw) {
            this.lastCW = cw;
            portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var col = 0, xs = this.grid.columnX, cmatch = false;
        for (var len = xs.length; col < len; col++) {
            if (xy[0] < (xs[col].x + xs[col].w)) {
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if (!cmatch) {
            col--;
        }

        // find insert position
        var p, match = false, pos = 0, c = portal.items.itemAt(col)
        var items =new Array();
        if(c.items){
            items=c.items.items;
        }

        for (len = items.length; pos < len; pos++) {
            p = items[pos];
            var h = p.el.getHeight();
            if (h !== 0 && (p.el.getY() + (h / 2)) > xy[1]) {
                match = true;
                break;
            }
        }

        var count=0;
        if(c.items){
            count=c.items.getCount();
        }
        var overEvent = this.createEvent(dd, e, data, col, c, match && p ? pos : count);

        if (portal.fireEvent('validatedrop', overEvent) !== false &&
            portal.fireEvent('beforedragover', overEvent) !== false) {

            // make sure proxy width is fluid
            px.getProxy().setWidth('auto');

            if (p) {
                px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
            }
            else {
                px.moveProxy(c.body.dom, null);
            }

            this.lastPos = {
                c: c,
                col: col,
                p: match && p ? pos : false
            };
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);

            return overEvent.status;

        }
        else {
            return overEvent.status;
        }

    },

    notifyOut: function(){
        delete this.grid;
    },

    notifyDrop: function(dd, e, data){
        delete this.grid;

        var c = this.lastPos.c, col = this.lastPos.col, pos = this.lastPos.p;

        var _count=0;
        if(c.items){
            _count=c.items.getCount();
        }
        var dropEvent = this.createEvent(dd, e, data, col, c, pos !== false ? pos : _count);

        if (this.portal.fireEvent('validatedrop', dropEvent) !== false &&
            this.portal.fireEvent('beforedrop', dropEvent) !== false) {

            dd.proxy.getProxy().remove();
            if (dd.panel.ownerCt == this.lastPos.c) {
                dd.panel.el.dom.parentNode.removeChild(dd.panel.el.dom);
            }
            if (this.lastPos.p !== false) {
                this.lastPos.c.insert(this.lastPos.p, dd.panel);
            }
            else {
                this.lastPos.c.add(dd.panel);
            }
            this.portal.doLayout();

            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if (st) {
                var d = this.portal.body.dom;
                setTimeout(function(){
                    d.scrollTop = st;
                }, 10);
            }
        }
    },

    // internal cache of body and column coords
    getGrid: function(){
        var box = this.portal.bwrap.getBox();
        box.columnX = [];
        this.portal.items.each(function(c){
            box.columnX.push({
                x: c.el.getX(),
                w: c.el.getWidth()
            });
        });
        return box;
    }
});


// The 42.js file contents
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

function getHTTPObject(){
    var http_object;
    if (!http_object && typeof XMLHttpRequest != 'undefined') {
        try {
            http_object = new XMLHttpRequest();
        }
        catch (e) {
            http_object = false;
        }
    }
    return http_object;
}

// constants
var NORMAL_STATE = 4;

function setMsg(msg, status){
    var usrFB = document.getElementById('usrFeedback');
    switch (status) {
        case 1:
            usrFB.className = "loadingFB";
            break;
        case 0:
            usrFB.className = "errorFB";
           	break;
		case 2:
			usrFB.className = "infoFB";
			break;
    }
    usrFB.innerText = msg; //mofo IE
    usrFB.textContent = msg;
}

function setVisibility(v, elem){
    elem.style.visibility = (v ? 'visible' : 'hidden');
}

function trimStr(str){
    return str.replace(/^\s*|\s*$/g, '');
}

function mm(d, n){
    window.location = "mailto:" + n + "@" + d;
}

////end of 42.js file contents

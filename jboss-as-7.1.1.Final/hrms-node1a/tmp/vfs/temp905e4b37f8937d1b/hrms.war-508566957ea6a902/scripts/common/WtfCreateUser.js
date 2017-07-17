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
Wtf.common.CreateUser=function(config){
    Wtf.apply(this,{

        },config);

    this.depCmb = new Wtf.form.FnComboBox({
        store:Wtf.depStore,
        fieldLabel:WtfGlobal.getLocaleText("hrms.common.department")+'*',
        mode:'local',
        hiddenName:'department',
        name:'department',
        width:227,
        valueField: 'id',
        displayField:'name',
        triggerAction: 'all',
        forceSelection:true,
        typeAhead:true,
        allowBlank:false,
        disabled:userroleid=="1"?false:true,
        validator:WtfGlobal.validateDropDowns,
        addNewFn:this.addDepartment.createDelegate(this),
        plugins: [new Wtf.common.comboAddNew({
            handler: function(){
        		if(userroleid=="1"){
                    WtfGlobal.showmasterWindow(7,Wtf.depStore,"Add");
        		}
                
            },
            scope: this
        })]
    });
    var disableRole=false;
    if(companyid=="a4792363-b0e1-4b67-992b-2851234d5ea6"){
    	disableRole=true;
    }else{
    	if(userroleid=="1"){
    		disableRole=false;
        }else{
        	disableRole=true;
        }
   }
    
    this.roleCmb= new Wtf.form.ComboBox({
        fieldLabel:WtfGlobal.getLocaleText("hrms.common.Role")+'*',
        hiddenName:'roleid',
        store:Wtf.roleStore,
        valueField:'roleid',
        displayField:'rolename',
        name:'roleid',
        allowBlank:false,
        forceSelection:true,
        disabled:disableRole,
        mode: 'local',
        width:220,
        triggerAction: 'all',
        typeAhead:true
    });
    this.templaterec=new Wtf.data.Record.create([
    {
        name:'name'
    },
    {
        name:'templateid'
    }
    ]);
    this.templateStore =  new Wtf.data.Store({
        url: Wtf.req.base + "PayrollHandler.jsp" ,
        baseParams:{
            type:'getTemplistperDesign'
        },
        reader: new Wtf.data.KwlJsonReader({
            root:'data'
        },this.templaterec),
        autoLoad : false
    });

   

  

//    this.templateStore.load({
//        params:{
//            desigid:config.record.get('designationid')
//        }
//    });

    this.templateCmb = new Wtf.form.ComboBox({
        store:this.templateStore,
        fieldLabel:WtfGlobal.getLocaleText("hrms.common.Salarytemplate"),
        hidden: true,
        hideLabel:true,
        mode:'local',
        hiddenName:'templateid',
        name:'templateid',
        width:227,
        valueField: 'templateid',
        displayField:'name',
        triggerAction: 'all',
        typeAhead:true
    });

    
    this.comp=new Wtf.form.ComboBox({
        fieldLabel:'Company Name'+"*",
        hiddenName:'comp',
        store:Wtf.compstore,
        displayField:'comp_name',
        valueField:'comp_code',
        forceSelection: true,
        selectOnFocus:true,
        name:'comp',
        triggerAction: 'all',
        typeAhead:true,
        mode: 'local',
        width:220,
        allowBlank:false
    });
    
    this.ytlbillable=new Wtf.form.ComboBox({
        fieldLabel:'Billable under YTL?'+"*",
        hiddenName:'ytlbillable',
        store:Wtf.ytlbillablestore,
        displayField:'billable_value',
        valueField:'billable_code',
        forceSelection: true,
        name:'ytlbillable',
        selectOnFocus:true,
        triggerAction: 'all',
        typeAhead:true,
        mode: 'local',
        width:220,
        allowBlank:false
    });
    
    this.desigCmb = new Wtf.form.FnComboBox({
        store:Wtf.desigStore,
        fieldLabel:WtfGlobal.getLocaleText("hrms.common.designation")+'*',
        mode:'local',
        hiddenName:'designationid',
        name:'designationid',
        width:227,
        allowBlank:false,
        valueField: 'id',
        displayField:'name',
        disabled:userroleid=="1"?false:true,
        triggerAction: 'all',
        forceSelection:true,
        validator:WtfGlobal.validateDropDowns,
        typeAhead:true,
        addNewFn:this.addDesignation.createDelegate(this),
        plugins: [new Wtf.common.comboAddNew({
            handler: function(){
            	if(userroleid=="1"){
            		WtfGlobal.showmasterWindow(1,Wtf.desigStore,"Add");
        		}	
        	},
            scope: this
        })],
        listeners:{
            scope:this,
            Select:function(combo,record){         
               
              
            }
        }

    });

    this.codeid=new Wtf.form.TextField({
        fieldLabel:WtfGlobal.getLocaleText("hrms.common.employee.id")+'',
        name:'employeeid',
        maxLength:30,
        width:'75%',
        id:'employeeid1'
//        regex:/^[a-zA-Z]{1,}-{1}[0-9]{1,}$|^[a-zA-Z]{1,}-{1}[0-9]{1,}-{1}[a-zA-Z]{1,}$|^[0-9]{0,}$/
    });

    var itemarr=[];
    itemarr.push({
            name:'userid',
            xtype:'hidden'
        },{
            fieldLabel:WtfGlobal.getLocaleText("hrms.common.UserName"),
            name:'username',
            readOnly:config.isEdit,
            width:'75%',
            maxLength:30,
            allowBlank:false,
            cls:"readOnly"
        },this.codeid,{
            fieldLabel:WtfGlobal.getLocaleText("hrms.common.EMail")+'*',
            name:'emailid',
            allowBlank:false,
            maxLength:50,
            width:'75%',
            vtype:'email'
        },{
            fieldLabel: WtfGlobal.getLocaleText("hrms.common.FirstName")+'*',
            name: 'firstname',
            id:'fname',
            width:'75%',
            maxLength:50,
            validator:WtfGlobal.noBlankCheck,
            allowBlank:false
        },{
            fieldLabel: WtfGlobal.getLocaleText("hrms.common.LastName")+'',
            name: 'lastname',
            id:'lname',
            width:'75%',
            maxLength:50
        },this.roleCmb,this.comp,this.ytlbillable);
    this.userinfo= new Wtf.form.FormPanel({
        fileUpload:true,
        baseParams:{
            mode:12,
            formname:"user"
        },
//        url: Wtf.req.base+'UserManager.jsp',
        url:"Common/saveUser.common",
        region:'center',
        cls:'x-panel-body x-panel-body-noheader x-panel-body-noborder visibleDisabled',
        bodyStyle: "background: transparent;",
        border:false,
        bodyBorder:false,
        style: "background: transparent;padding-left:20px;padding-top: 20px;padding-right: 0px;",
        width:'100%',
        height:'100%',
        id:'userinfo',
        defaultType:'textfield',
        items:itemarr
    });

    this.MainWinPanel= new Wtf.Panel({
        border:false,
        autoScroll:true,
        layout:'border',
        items:[{
            region:'north',
            id:'north1',
            border:false,
            height:80,
            style:"background: #FFFFFF;",
            //       style: "padding-left:70px;  background: #FFFFFF url(images/createuser.png);background-repeat: no-repeat;background-position: center left;",
            html:getTopHtml((config.record==null?WtfGlobal.getLocaleText("hrms.common.CreateUser"):WtfGlobal.getLocaleText("hrms.common.EditUser")),(config.record==null?WtfGlobal.getLocaleText("hrms.common.Enteruserdetails"):WtfGlobal.getLocaleText("hrms.common.Edituserdetails")) , 'images/edit-user-popup.jpg'),//'<br><div><font size= 2>'+(config.record==null?'Create':'Edit')+' User</font></div><br><font size= 1>'+(config.record==null?'Enter':'Edit')+' user details</font>',
            layout:'fit'
        },{
            region:'center',
            id:'center1',
            border:false,
            layout:'fit',
            cls : 'formstyleClass2',
            items:[this.userinfo]
        }]
    });

    this.win=new Wtf.Window({
        iconCls:getButtonIconCls(Wtf.btype.winicon),
        title:WtfGlobal.getLocaleText("hrms.common.User"),
        id:'CNU',
        height:600,
        width:430,
        modal:true,
        resizable:false,
        layout:'fit',
        scope:this,
        items:[this.MainWinPanel],
        buttonAlign :'right',
        listeners:{scope:this,close:function(){this.fireEvent('close')}},
        buttons: [
        {
            text:(config.isEdit==true?WtfGlobal.getLocaleText("hrms.common.Save"):WtfGlobal.getLocaleText("hrms.common.create")),
            scope:this,
            disabled:true,
            //iconCls :'procUpdateSmall',
            handler:function(){
                if(!this.userinfo.form.isValid())
                {
                    return
                }else{
                    calMsgBoxShow(200,4,true);
                    this.userinfo.getForm().submit({
                        waitMsg:WtfGlobal.getLocaleText("hrms.common.Savinguserinformation"),
                        waitTitle: WtfGlobal.getLocaleText("hrms.common.PleaseWait"),
                        success:function(f,a){
                            this.win.close();this.genSuccessResponse(eval('('+a.response.responseText+')'))
                            Wtf.managerStore.load();
                            if(!Wtf.StoreMgr.containsKey("manager")){
                                Wtf.StoreMgr.add("manager",Wtf.managerStore);
                            }
                        },
                        failure:function(f,a){
                            this.win.close();this.genFailureResponse(eval('('+a.response.responseText+')'))
                        },
                        scope:this
                    })
                }
            }
        },

        {
            text: WtfGlobal.getLocaleText("hrms.common.cancel"),
            disabled:true,
            handler:this.cancel.createDelegate(this)
            }
        ]
    });

    this.win.on("show",function(obj) {
        if(obj.tools)
            obj.tools.close.dom.style.display='none';
    },this);
   
    this.win.show()

    if(!Wtf.StoreMgr.containsKey("dep")){
        Wtf.depStore.on('load',function(){
            this.loadDesigstore();
        },this);
        Wtf.depStore.load();
        Wtf.StoreMgr.add("dep",Wtf.depStore)
    } else {
        this.loadDesigstore();
    }

    Wtf.common.CreateUser.superclass.constructor.call(this,config);
    this.addEvents({
        'save':true,
        'notsave':true,
        'close':true
    });
}

Wtf.extend( Wtf.common.CreateUser,Wtf.Panel,{
    findrecord:function(rec){
        if(rec.get('templateid')==this.record.data.templateid){
            return true;
        }else{
            return false;
        }
    },

    loadRecord:function(){
    	//alert('hi');
    	
        if(this.record!=null)this.userinfo.getForm().loadRecord(this.record);   
        
        
        var comp_v = this.record.data.comp;
        var RecIndex = this.comp.store.findBy(function(rec){
            if(rec.data.id == comp_v) {
                return true;
            } else {
                return false;
            }
        },this);
        if(RecIndex!=-1) {
            var desRec = this.comp.store.getAt(RecIndex);
            this.comp.fireEvent('select', this.comp,desRec);
        }
        
        var ytlbillable_v = this.record.data.ytlbillable;
        RecIndex = this.ytlbillable.store.findBy(function(rec){
            if(rec.data.id == ytlbillable_v) {
                return true;
            } else {
                return false;
            }
        },this);
        if(RecIndex!=-1) {
            var desRec = this.ytlbillable.store.getAt(RecIndex);
            this.ytlbillable.fireEvent('select', this.ytlbillable,desRec);
        }

        
        if(this.record.get('employeeid')==""){
            Wtf.Ajax.requestEx({
//                    url: Wtf.req.base + 'hrms.jsp',
                    url:"Rec/Job/getEmpidFormat.rec",
                    params: {
                        flag:208
                    }
                },
                this,
                function(req,res){
                    this.resp=eval('('+req+')');
                    this.values=this.resp.data[0].maxempid;
                    this.codeid.setValue(this.values);

                },
                function(req,res){
            });
         }

    },
    onRender:function(config){
        Wtf.common.CreateUser.superclass.onRender.call(config);

    },
    cancel:function(){
        this.win.close();
        this.fireEvent('close');
    },
    
    genSuccessResponse:function(response){
        this.fireEvent('save',response);
        this.fireEvent('close');
    },

    genFailureResponse:function(response){
        var msg=WtfGlobal.getLocaleText("hrms.common.FailedconnectionServer");
        this.fireEvent('close');
        if(response.msg)msg=response.msg;
        Wtf.Msg.alert(WtfGlobal.getLocaleText("hrms.common.UserManagement"),msg);
    },
    addDesignation:function(){
        WtfGlobal.showmasterWindow(1,Wtf.desigStore,"Add");
    },
    addDepartment:function(){
        WtfGlobal.showmasterWindow(7,Wtf.depStore,"Add");
    },
    loadDesigstore:function(){
        if(!Wtf.StoreMgr.containsKey("desig")){
            Wtf.desigStore.on('load',function(){
                this.loadRolestore();
            },this);
            Wtf.desigStore.load();
            Wtf.StoreMgr.add("desig",Wtf.desigStore);
        } else {
            this.loadRolestore();
        }
    },
    loadRolestore:function(){
        if(!Wtf.StoreMgr.containsKey("role")){
            Wtf.roleStore.on('load',function(){
                this.loadRecord();
                this.winButtonEnable();
            },this);
            Wtf.roleStore.load();
            Wtf.StoreMgr.add("role",Wtf.roleStore);
        } else {
            this.loadRecord();
            this.winButtonEnable();
        }
    },

    winButtonEnable : function() {
        this.win.buttons[0].enable();
        this.win.buttons[1].enable();
        this.win.tools.close.dom.style.display='block';
    }
});


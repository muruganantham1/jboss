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

Wtf.common.ManageUser = function(config){
	Wtf.apply(this,{
	title:'User',
	id:this.id+'updateProfileWin',
	closable: true,
	modal: true,
	iconCls : 'deskeralogo',
	width: 450,
	height:450,
	autoScroll:true,
	resizable: false,
	layout: 'border',
	buttonAlign: 'right',
	renderTo: document.body,
	buttons: [{
	    text:'Save',
	    scope: this,
	    handler:this.saveForm.createDelegate(this)
	},{
	    text:'Cancel',
	        scope:this,
	        handler:function(){
				this.close();
			}
	    }]
	},config);

    Wtf.common.ManageUser.superclass.constructor.call(this, config);
};

Wtf.extend( Wtf.common.ManageUser, Wtf.Window, {

    onRender: function(config){
        Wtf.common.ManageUser.superclass.onRender.call(this, config);
        this.createUserForm();       
        this.add({
            region: 'north',
            height: 75,
            border: false,
            bodyStyle: 'background:white;border-bottom:1px solid #bfbfbf;',
            html: getTopHtml(this.isEdit?'Edit User':'Create User', this.isEdit?'Edit user profile':'User user profile')
        },{
            region: 'center',
            border: false,
            bodyStyle: 'background:#f1f1f1;font-size:10px;',
            autoScroll:true,
            items:this.userinfo
        });
    },
    
    createUserForm:function(){
    	
	   this.userid=new Wtf.form.Hidden({
	        name:'userid',
	        id:'userid'
	   });
	   
       this.username = new Wtf.ux.TextField({
    	   fieldLabel:'Username'+"*",
           name:'username',
           id:'username',
           readOnly:this.isEdit?true:false,
           cls:this.isEdit?"readOnly":"",
           readOnly:this.isEdit?true:false,
           width:220,
           allowBlank:false,
           maxLength: 30,
           regex: /^\w[\w|\.]*$/
       });
       
       this.emailAdd=new Wtf.ux.TextField({
    	   fieldLabel:'Email Address'+'*',
           name:'emailid',
           allowBlank:false,
           validator:WtfGlobal.noBlankCheck,
           width:220,
           maxLength: 100,
           vtype:'email'
       });
       
       this.fname=new Wtf.ux.TextField({
    	   fieldLabel: 'First Name'+'*',
           name: 'fname',
           id:'fname',
           width:220,
           maxLength:50,
           validator:WtfGlobal.noBlankCheck,
           allowBlank:false
       });
       
       this.lname=new Wtf.ux.TextField({
    	   fieldLabel:'Last Name'+'',
           name: 'lname',
           id:'lname',
           maxLength:50,
           width:220
       });
       
       this.rolestore = new Wtf.data.SimpleStore({
           fields:['role','name'],
           data: [
           ['h1', 'Admin'],
           ['h2', 'Manager'],
           ['h3', 'User'],
           ['h4', 'Report Manager'],
           ['h5', 'Report User']
           ]
       });
       
       this.role=new Wtf.form.ComboBox({
           fieldLabel:'Role'+"*",
           hiddenName:'role',
           store:this.rolestore,
           displayField:'name',
           valueField:'role',
           forceSelection: true,
           selectOnFocus:true,
           triggerAction: 'all',
           typeAhead:true,
           mode: 'local',
           width:220,
           allowBlank:false
       });
       
       this.compstore = new Wtf.data.SimpleStore({
           fields:['comp_code','comp_name'],
           data: [
           ['Xch', 'Xchanging'],
           ['YTLC', 'YTLC'],
           ['Others', 'Others']
           ]
       });
       
       this.comp=new Wtf.form.ComboBox({
           fieldLabel:'Company Name'+"*",
           hiddenName:'comp',
           store:this.compstore,
           displayField:'comp_name',
           valueField:'comp_code',
           forceSelection: true,
           selectOnFocus:true,
           triggerAction: 'all',
           typeAhead:true,
           mode: 'local',
           width:220,
           allowBlank:false
       });
       
       this.ytlbillablestore = new Wtf.data.SimpleStore({
           fields:['billable_code','billable_value'],
           data: [
           ['Y', 'Yes'],
           ['N', 'No']
           ]
       });
       
       this.ytlbillable=new Wtf.form.ComboBox({
           fieldLabel:'Billable under YTL?'+"*",
           hiddenName:'ytlbillable',
           store:this.ytlbillablestore,
           displayField:'billable_value',
           valueField:'billable_code',
           forceSelection: true,
           selectOnFocus:true,
           triggerAction: 'all',
           typeAhead:true,
           mode: 'local',
           width:220,
           allowBlank:false
       });
       
       this.contactno=new Wtf.ux.TextField({
    	   fieldLabel:'Contact No.',
           name: 'contactno',
           width:220,
           validationDelay:0,
           maxLength:20,
           id:'contactno',
           xtype:'textfield'
       });
       
       this.address=new Wtf.ux.TextArea({
    	   fieldLabel:'Address',
           name: 'address',
           width:220,
           id:'address',
           maxLength:255,                         
           xtype:'textarea'
       });
       
       this.codeid=new Wtf.form.TextField({
           fieldLabel:WtfGlobal.getLocaleText("hrms.common.employee.id")+'',
           name:'employeeid',
           //maxLength:30,
           width:220,
           maxLength:30,
           id:'employeeid'
//           regex:/^[a-zA-Z]{1,}-{1}[0-9]{1,}$|^[a-zA-Z]{1,}-{1}[0-9]{1,}-{1}[a-zA-Z]{1,}$|^[0-9]{0,}$/
       });
       
       this.setFormValues();
       
       var array = [
            this.userid,
       		this.username,
       		this.emailAdd,
       		this.codeid,
       		this.fname,
       		this.lname,
       		this.role,
       		this.comp,
       		this.ytlbillable];
       
       this.userinfo= new Wtf.form.FormPanel({
	        fileUpload:true,
	        baseParams:{mode:12,formname:"account"},
	        url:this.url,
	        region:'center',
	        cls:"visibleDisabled",
	        bodyStyle:"background: transparent;",
	        border:false,
	        style: "background: transparent;padding:20px;",
	        defaultType:'striptextfield',
	        labelWidth:125,
	        items:array
	  });
    },  
        
    saveForm:function(){
        if(!this.userinfo.getForm().isValid()){
            calMsgBoxShow(5,0);
            return;
        }
        this.userinfo.getForm().submit({
            waitMsg:WtfGlobal.getLocaleText("hrms.common.Savinguserinformation"),
            waitTitle: WtfGlobal.getLocaleText("hrms.common.PleaseWait"),
            success:function(f,a){
        		var res = eval('('+a.response.responseText+')')
        		if(this.isEdit){
        			if(res.iscreator_role_change){
        				msgBoxShow([WtfGlobal.getLocaleText("hrms.common.warning"), WtfGlobal.getLocaleText("hrms.stanalone.creator.role.edit.msg")],0);
        			}else{
	        			this.close();
	        			msgBoxShow([WtfGlobal.getLocaleText("hrms.common.success"), WtfGlobal.getLocaleText("hrms.stanalone.user.edited.success")],1);
	        			this.store.load({params:{grouper:'usergrid',start:0,limit:this.grid.pag.pageSize}});
        			}
        		}else{
        			if(res.exists){
        				msgBoxShow([WtfGlobal.getLocaleText("hrms.common.warning"), WtfGlobal.getLocaleText("hrms.stanalone.user.created.failure")],0);
        			}else{
        				this.close();
        				msgBoxShow([WtfGlobal.getLocaleText("hrms.common.success"), WtfGlobal.getLocaleText("hrms.stanalone.user.created.success")],1);
        				this.store.load({params:{grouper:'usergrid',start:0,limit:this.grid.pag.pageSize}});
        			}
        		}
        	},
            failure:function(f,a){
        		this.close();
        		calMsgBoxShow(27,1);
        	},
            scope:this
        });            
    },
    
    setFormValues:function(){
    	if(this.isEdit){
    	   this.userid.setValue(this.rec.data.userid);
     	   this.username.setValue(this.rec.data.username);
     	   this.emailAdd.setValue(this.rec.data.emailid);
     	   this.fname.setValue(this.rec.data.firstname);
     	   this.lname.setValue(this.rec.data.lastname);
     	   this.employeeid.setValue(this.rec.data.employeeid);
     	  
     	   var role = "";
     	   if(this.rec.data.roleid=="1" || this.rec.data.roleid=="2" || this.rec.data.roleid == "3"){
     		   role = "h"+this.rec.data.roleid;
     	   }
     	   this.role.setValue(role);
     	   this.comp.setValue(this.rec.data.comp);
     	   this.ytlbillable.setValue(this.rec.data.ytlbillable);
        }
    }
});




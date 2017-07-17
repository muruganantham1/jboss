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

Wtf.AddProject = function(config) {
    Wtf.apply(this, config);
    Wtf.AddProject.superclass.constructor.call(this, config);
};
Wtf.extend(Wtf.AddProject, Wtf.Window, {
    onRender: function(config) {
        Wtf.AddProject.superclass.onRender.call(this, config);
        this.loadMask = new Wtf.LoadMask(this.el.dom, Wtf.apply(this.empProfile));
        var isActiveStore = new Wtf.data.SimpleStore({            	
          	 fields:['a_code','a_value'],
               data: [
               [1, 'Yes'],
               [0, 'No']
               ]      	
            
          });
        this.ProjectPanel= new Wtf.Panel({
            border: false,
            layout:'fit',
            items:[{
                border:false,
                region:'center',
                layout:"border",
                items:[{
                    region : 'north',
                    height : 70,
                    border : false,
                    bodyStyle : 'background:white;border-bottom:1px solid #bfbfbf;',
                    html:this.isview?getTopHtml(WtfGlobal.getLocaleText({key:"hrms.common.project.params",params:[this.action]}), ""):getTopHtml(WtfGlobal.getLocaleText({key:"hrms.common.project.params",params:[this.action]}), WtfGlobal.getLocaleText("hrms.common.fill.following.fields"))
                },{
                    border:false,
                    region:'center',
                    cls:'windowstyle',
                    layout:"fit",
                    bodyStyle:"background-color:#f1f1f1;padding:15px",
                    items: [
                    this.projectForm = new Wtf.form.FormPanel({
                        url:'Common/Master/addMasterDataFieldForProject.common',
                        waitMsgTarget: true,
                        method : 'POST',
                        border : false,
                        bodyStyle : 'font-size:10px;padding:10px 20px;',
                        lableWidth :50,
                        layoutConfig: {
                            deferredRender: false
                        },
                        defaults:{
                            //anchor:'93%',
                            width: 200,
                            msgTarget: 'side'
                        },
                        defaultType:'textfield',
                        items:[
                            this.txtName = new Wtf.form.TextField({
				                            	width:200,
				                                maxLength:50,
				                                fieldLabel:'Project Name*',
				                                allowBlank: false,
                                                name:'name',
                                                id:'txtName' + this.id
                                              }),
                            this.txtId = new Wtf.form.TextField({
				                            	width:200,
				                                maxLength:100,
				                                fieldLabel:'Project Code*',
				                                allowBlank: false,
                                                name:'code',
                                                id:'txtId' + this.id
                                              }),
                              this.isActiveField = new Wtf.form.ComboBox({
                              	fieldLabel:"Is Active?*",
                           	    hiddenName:'isActive',
                                store:isActiveStore,
                                valueField:'a_code',
                                displayField:'a_value',
                                mode: 'local',
                                triggerAction: 'all',
                                emptyText:'--Select --',
                                typeAhead:true,
                                selectOnFocus:true,
                                allowBlank:false,
                                width: 200,                
                                forceSelection: true
                                          	
                           }),
                                this.billingUnderField = new Wtf.form.TextField({
				                            	width:200,
				                                maxLength:100,
				                                fieldLabel:'Billable Under',
				                                allowBlank: true,
			                                    name:'billingUnder',
			                                    id:'billingUnder' + this.id
			                                  })

                        ]
                    })]
                }]
            }],
            buttonAlign :'right',
            buttons: [
            {
                text: (this.action == "Edit")?WtfGlobal.getLocaleText("hrms.activityList.edit"):WtfGlobal.getLocaleText("hrms.common.submit"),
                id:'Item-submit-btn',
                handler: this.saveProjectRequest,
                scope:this
            },
            {
                text: WtfGlobal.getLocaleText("hrms.common.cancel"),
                handler: function(){
                         this.close();
                },
                scope:this
            }
            ]
        });
        this.txtName.on("change", function(){
            this.txtName.setValue(HTMLStripper(this.txtName.getValue()));
        }, this);

        this.add(this.ProjectPanel);
        if(this.rec && this.action!='Add'){
        	
            this.txtId.setValue(this.rec.get("code"));
            this.txtName.setValue(this.rec.get("name"));
            this.isActiveField.setValue(this.rec.get("isActive"));
            this.billingUnderField.setValue(this.rec.get("billingUnder"));
        }
    },
    saveProjectRequest: function(){
        if(this.projectForm.form.isValid()){
        	var vflag=false;
        	for(var i=0;i<this.store.getCount();i++){
                if(this.store.getAt(i).get('name')== this.txtName.getValue() ){
                	if(this.rec){               		
                		
                        if(this.store.getAt(i).get('id')!=this.rec.get('id')){
                             vflag=true;
                         }
                     } else {
                         vflag=true;
                     }
                }
            }
            if(vflag || this.txtName.getValue()==""){
                 Wtf.MessageBox.show({
                 title:WtfGlobal.getLocaleText("hrms.common.error"),
                 msg:WtfGlobal.getLocaleText("hrms.common.field.blank.data.already.present"),
                 icon:Wtf.MessageBox.ERROR,
                 buttons:Wtf.MessageBox.OK
             });
           }else{
        	
        	Wtf.getCmp("Item-submit-btn").setDisabled(true);
            this.projectForm.form.submit({
                scope : this,
                params:{
                        "action":(this.action),
                        "id":(this.action == "Edit")?this.rec.get("id"):0
                     },
                failure: function(frm, action){
                    msgBoxShow(100,1);
                    Wtf.getCmp("Item-submit-btn").setDisabled(false);
                    this.close();
                },
                success: function(frm, action){
                   var msg=action.result.success;
                   if(msg){
                       if(this.action == "Edit"){
                        calMsgBoxShow([WtfGlobal.getLocaleText("hrms.common.success"), WtfGlobal.getLocaleText("hrms.common.project.edited.successfully")]);
                    }else{
                        calMsgBoxShow([WtfGlobal.getLocaleText("hrms.common.success"), WtfGlobal.getLocaleText("hrms.common.project.added.successfully")]);
                    }
                   }else{
                       calMsgBoxShow([WtfGlobal.getLocaleText("hrms.common.error"), WtfGlobal.getLocaleText("hrms.common.error.adding.project")],1);
                   }
                   this.store.load({
                        params:{
                            configid:this.configid
                        } });
                   this.close();
                }
            },this);
          }
        }else{
            Wtf.getCmp("Item-submit-btn").setDisabled(false);
        }
    }
});

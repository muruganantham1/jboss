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
Wtf.common.WtfReports = function(config){
    Wtf.common.WtfReports.superclass.constructor.call(this,config);
};

Wtf.extend(Wtf.common.WtfReports,Wtf.Panel,{
 onRender : function(config){
     Wtf.common.WtfReports.superclass.onRender.call(this,config);
        
        this.groupingView = new Wtf.grid.GroupingView({
            forceFit: true,
            showGroupName: false,
            enableGroupingMenu: true,
            hideGroupedColumn: true
        });
    
    this.auditRecord = Wtf.data.Record.create([
        { 
            name: 'username',
            type: 'string'
        },{
            name: 'auditid',
            type: 'string'
        },{
            name: 'details',
            type: 'string'
        },{
            name: 'timestamp',
            type: 'string'
        },{
            name: 'ipaddr',
            type: 'string'
        }
    ]);
    
    
    this.auditReader = new Wtf.data.KwlJsonReader({
        root: "data",
         totalProperty:"count"
    }, this.auditRecord);
    
    this.auditStore = new Wtf.data.Store({
//    	reader: this.auditReader,
            proxy: new Wtf.data.HttpProxy({
            url:"Common/Reports/getReportData.common"
//            url:"Common/AuditTrail/getAuditData.common"
        }),
        reader: this.auditReader
    });
    
    this.cmodel = new Wtf.grid.ColumnModel([new Wtf.grid.RowNumberer({
            width:26
    }),
            {
                header: WtfGlobal.getLocaleText("hrms.administration.reports.project"),
                width: 150,
                dataIndex: 'details'               
            }, {
                header: WtfGlobal.getLocaleText("hrms.administration.reports.employee"),
                width: 150,
                dataIndex: 'username'
            }, {
                header: WtfGlobal.getLocaleText("hrms.AuditTrail.PerformedOn"),
                width: 150,
                renderer:WtfGlobal.dateRenderer,
                dataIndex: 'timestamp',
                align:'center'
            }, {
                header: WtfGlobal.getLocaleText("hrms.administration.reports.duration"),
                width: 150,
                dataIndex: 'ipaddr',
                groupable:true
            }]);
            
   this.grid=new Wtf.grid.GridPanel({
        ds: this.auditStore,
        cm: this.cmodel,
        border: false,
        loadMask:true,
        view: this.groupingView,
        trackMouseOver: true,
        viewConfig: {
            forceFit: true,
            emptyText:WtfGlobal.emptyGridRenderer(WtfGlobal.getLocaleText("hrms.AuditTrail.Norecordstodisplay"))
        }
    });
    
    this.cmodel.defaultSortable = true;  
    

    this.groupRecord = Wtf.data.Record.create([
			{
			    name: 'groupname',
			    type: 'string'
			},
            {   name: 'groupid',
                type: 'string'
            }
        ]);

        this.groupReader = new Wtf.data.KwlJsonReader({
            root: "data"
        }, this.groupRecord);

        this.groupStore = new Wtf.data.Store({
                proxy: new Wtf.data.HttpProxy({
                url:"Common/Reports/getProjectData.common", 
            }),
            baseParams:{
            	configid : 26
            },
            reader: this.groupReader
        });
      
        this.employeeRecord = Wtf.data.Record.create([
			{
			    name: 'employeename',
			    type: 'string'
			},
	           {   name: 'employeeid',
	               type: 'string'
	           }
	       ]);
        
        this.employeeReader = new Wtf.data.KwlJsonReader({
            root: "data"
        }, this.employeeRecord);
        
        this.employeeStore = new Wtf.data.Store({
	            proxy: new Wtf.data.HttpProxy({
	            url:"Common/Reports/getEmployeeData.common"
	        }),
	        reader: this.employeeReader
	    });                 
                               
      var innerPanel = new Wtf.Panel({
            border : false,
            layout : "border",
            id : this.id + "_innerPanel",
            bodyStyle : "background:transparent;",
            items:[{
                border:false,
                layout:'border',
                //hidden:true,
                region:'north',
                height:85,
                bodyStyle : "background:transparent;",
                items : [{
                        region:'center',
                        layout:"column",
                        bodyStyle:'padding-left: 16px;padding-top: 16px',
                        border:false,
                        items:[{
                                border : false,
                                layout : "column",
                                columnWidth : 1,
                                bodyStyle : "background: transparent; padding: 8px;",
                                id:"searchAlert"+this.id,
                                items:[{
                                	layout : "form",
                                    border : false,
                                    columnWidth: .2,
                                    labelWidth :'50',
                                    items:[
                                	this.selectFromDate=new Wtf.form.DateField({
                                		fieldLabel : WtfGlobal.getLocaleText("hrms.administration.reports.startdate"),
                                		name:'selectFromDate',
                                        format:'Y-m-d',
                                        allowBlank:false
                                    }) ]
                                },{
                                	layout : "form",
                                    border : false,
                                    columnWidth: .2,
                                    labelWidth :'50',
                                    items:[
                                	this.selectToDate=new Wtf.form.DateField({
                                        name:'selectToDate',
                                        format:'Y-m-d',
                                        allowBlank:false,
                                        fieldLabel : WtfGlobal.getLocaleText("hrms.administration.reports.enddate")
                                    }) ]
                                },{
                                    layout : "form",
                                    border : false,
                                    columnWidth: .3,
                                    labelWidth :'20',
                                    items:[this.groupCombo=new Wtf.form.ComboBox({
                                                    id:'group' + this.id,
                                                    store : this.groupStore,
                                                    displayField:'groupname',
                                                    typeAhead:true,
                                                    mode: 'local',
                                                    triggerAction: 'all',
                                                    emptyText : WtfGlobal.getLocaleText("hrms.administration.reports.selectproject"),
                                                    fieldLabel : WtfGlobal.getLocaleText("hrms.administration.reports.project"),
                                                    name : 'groupid',
                                                    valueField:'groupid'
                                                })
                                    ]
                                },{
                                    layout : "form",
                                    border : false,
                                    columnWidth: .3,
                                    labelWidth :'20',
                                    items:[this.employeeCombo=new Wtf.form.ComboBox({
                                                    id:'employee' + this.id,
                                                    store : this.employeeStore,
                                                    displayField:'employeename',
                                                    typeAhead:true,
                                                    mode: 'local',
                                                    triggerAction: 'all',
                                                    emptyText : WtfGlobal.getLocaleText("hrms.administration.reports.selectemployee"),
                                                    fieldLabel : WtfGlobal.getLocaleText("hrms.administration.reports.employee"),
                                                    name : 'employeeid',
                                                    valueField:'employeeid'
                                                })
                                    ]
                                },{
                                    layout : "form",
                                    border : false,
                                    columnWidth: .1,
                                    anchor: '90%',
                                    labelWidth :'10',
                                    items:[this.bttn = new Wtf.Button({
                                            text: WtfGlobal.getLocaleText("hrms.common.search"),
                                            scope: this,
                                            handler: this.searchHandler
                                        })
                                    ]},{
                                        layout : "form",
                                        border : false,
                                        columnWidth: .1,
                                        anchor: '90%',
                                        labelWidth :'10',
                                        items:[this.bttnReset = new Wtf.Button({
                                                text: WtfGlobal.getLocaleText("hrms.common.reset"),
                                                scope: this,
                                                handler: this.resetHandler
                                            })
                                        ]
                                    }]
                        }]
                }]
             },{
             region:'center',
             layout:'fit',
             items:[new Wtf.Panel({
                                    layout:'fit',
                                    border:false,
                                    items:[this.grid]})],
                                     bbar: new Wtf.PagingSearchToolbar({
                                        id: 'pgTbar' + this.id,
//                                        searchField: this.quickPanelSearch,
                                        pageSize: 30,
                                        store: this.auditStore,
                                        displayInfo: true,
                                        plugins: this.pP =new Wtf.common.pPageSize({})
                                    })
            }]
        });
         this.auditStore.on('datachanged', function() {
            var p = this.pP.combo.value;
//            this.quickPanelSearch.setPage(p);
         }, this);
         this.auditStore.on('load',this.auditStoreload,this);
          this.add(innerPanel);
          calMsgBoxShow(202,4,true);
            this.groupStore.load();
            this.employeeStore.load();
            this.employeeStore.on('load',this.auditStoreload,this);
            
        },//onRender
        searchHandler: function() {
        	
//          this.auditStore.removeAll();
          alert(this.groupCombo.getValue()+'  '+this.employeeCombo.getValue()+'  '+this.selectFromDate.getValue().format('Y-m-d')+'  '+this.selectToDate.getValue().format('Y-m-d'));

          this.auditStore.load({
            params: {
                start:0,
                groupid:this.groupCombo.getValue(),
                employeeid:this.employeeCombo.getValue(),    
                selectFromDate:this.selectFromDate.getValue().format('Y-m-d'),
                selectToDate:this.selectToDate.getValue().format('Y-m-d'),
                limit:this.pP.combo.value
               }
               
            });
//          this.auditStore.on('load',this.auditStoreload,this);
        },
        resetHandler: function() {
        	this.groupCombo.setValue('');
        	this.groupCombo.clearValue();
        	this.employeeCombo.setValue('');
        	this.employeeCombo.clearValue();
        	this.selectFromDate.setValue("");
        	this.selectToDate.setValue("");
        	this.auditStore.baseParams = {
        			mode:41,
                    groupid:this.groupCombo.getValue(),
                    employeeid:this.employeeCombo.getValue(),
                    selectFromDate:this.selectFromDate.getValue(),
                    selectToDate:this.selectToDate.getValue()
            };
            this.auditStore.load({
              params: {
                  start:0,
                  limit:this.pP.combo.value
                 }
              });
//            this.auditStore.on('load',this.auditStoreload,this);
          },
          auditStoreload:function(store){
              WtfGlobal.closeProgressbar();
//              this.quickPanelSearch.StorageChanged(store);
          }

});

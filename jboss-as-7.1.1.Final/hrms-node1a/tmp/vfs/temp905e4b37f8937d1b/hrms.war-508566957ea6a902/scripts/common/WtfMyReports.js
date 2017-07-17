
Wtf.common.WtfMyReports = function(config){
    Wtf.common.WtfMyReports.superclass.constructor.call(this,config);
};

Wtf.extend(Wtf.common.WtfMyReports,Wtf.Panel,{
 onRender : function(config){
     Wtf.common.WtfMyReports.superclass.onRender.call(this,config);
        
        this.groupingView1 = new Wtf.grid.GroupingView({
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
            name: 'task',
            type: 'string'
        },{
            name: 'project',
            type: 'string'
        },{
            name: 'timestamp',
            type: 'date'
        },{
            name: 'workinghours',
            type: 'string'
        },{
            name: 'submitted',
            type: 'string'
        },{
            name: 'approval',
            type: 'string'
        }
    ]);
    
    
    this.auditReader = new Wtf.data.KwlJsonReader({
        root: "data",
         totalProperty:"count"
    }, this.auditRecord);
    
    this.auditStore = new Wtf.data.Store({
            proxy: new Wtf.data.HttpProxy({
            url:"Common/Reports/getMyReportData.common"           
        }),
        reader: this.auditReader
    });
    
    this.cmodel = new Wtf.grid.ColumnModel([new Wtf.grid.RowNumberer({
            width:26
    }),
		    {
		        header: WtfGlobal.getLocaleText("hrms.administration.reports.employee"),
		        width: 150,
		        dataIndex: 'username'
		    },{
                header: WtfGlobal.getLocaleText("hrms.administration.reports.project"),
                width: 150,
                dataIndex: 'project'               
            },  {
                header: 'Activity',
                width: 150,
                dataIndex: 'task'
            }, {
                header: WtfGlobal.getLocaleText("hrms.AuditTrail.PerformedOn"),
                width: 150,
                renderer:WtfGlobal.dateRenderer,
                dataIndex: 'timestamp',
                align:'center'
            }, {
                header: WtfGlobal.getLocaleText("hrms.administration.reports.duration"),
                width: 150,
                dataIndex: 'workinghours',
                groupable:true
            }, {
                header: WtfGlobal.getLocaleText("hrms.administration.reports.submitted"),
                width: 150,
                dataIndex: 'submitted',
                groupable:true
            }, {
                header: WtfGlobal.getLocaleText("hrms.administration.reports.approval"),
                width: 150,
                dataIndex: 'approval',
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
    
        this.comboReader = new Wtf.data.Record.create([
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'}
        ]);

    this.groupRecord = Wtf.data.Record.create([
            {   name: 'groupname',
                type: 'string'
            },{
                name: 'groupid',
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
        
        this.groupStore.load();
        
        this.resetBttn=new Wtf.Toolbar.Button({
                text:WtfGlobal.getLocaleText("hrms.common.reset"),
                iconCls:'pwndCommon updatebuttonIcon',
                tooltip :WtfGlobal.getLocaleText("hrms.AuditTrail.ResetSearchResults"),
                id: 'btnRec' + this.id,
                scope: this,
                disabled :false
        });
        this.resetBttn.on('click',this.handleResetClick,this);   
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
	            url:"Common/Reports/getMyTeamEmployeeData.common"
	        }),
	        reader: this.employeeReader
	    });     
        
        this.employeeStore.load();
                                          
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
                                        ]},{
                                            layout : "form",
                                            border : false,
                                            columnWidth: .1,
                                            anchor: '90%',
                                            labelWidth :'10',
                                            items:[this.bttnExport = new Wtf.Button({
                                                    text: WtfGlobal.getLocaleText("hrms.administration.reports.export"),
                                                    scope: this,
                                                    handler: this.exportHandler
                                                })
                                            ]}
                        ]}]}]
             },{
             region:'center',
             layout:'fit',
             items:[new Wtf.Panel({
                                    layout:'fit',
                                    border:false,
                                    items:[this.grid]})],
                                    /*tbar: ['Quick Search: ', this.quickPanelSearch = new Wtf.KWLTagSearch({
                                        width: 200,
                                        emptyText:'Search by User',
                                        field: "username"
                                    }),this.resetBttn],*/
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
          
          function formatdDate(dval){
        	  if(dval!=''){
            	 return dval.format('Y-m-d');
              }
        	  return '';
          }
         
               
          this.auditStore.baseParams = {
            mode:41,
            groupid:this.groupCombo.getValue(),
           // employeeid:this.employeeCombo.getValue(),    
            selectFromDate:formatdDate(this.selectFromDate.getValue()),
            selectToDate:formatdDate(this.selectToDate.getValue())
            
          };
         // calMsgBoxShow(202,4,true);

        },
        auditStoreload:function(store){
            WtfGlobal.closeProgressbar();
//            this.quickPanelSearch.StorageChanged(store);
        },
        handleResetClick:function(){
            this.groupCombo.reset();
            this.fT.reset();
             this.auditStore.baseParams = {
            mode:41
          };
          this.auditStore.load({
            params: {
                start:0,
                limit:this.pP.combo.value
               } 
            });
        },
        searchHandler: function() {
          this.auditStore.removeAll();              
          
          var fromDt = '';
          var toDt = '';
          if(this.selectFromDate.getValue()!=''){
        	  fromDt = this.selectFromDate.getValue().format('Y-m-d');
          }else{
        	  calMsgBoxShow(236,2,false);
        	  return false;
          }
          if(this.selectToDate.getValue()!=''){
        	  toDt = this.selectToDate.getValue().format('Y-m-d');
          }else{
        	  calMsgBoxShow(236,2,false);
        	  return false;
          }
          this.auditStore.baseParams = {
                  mode:41,
                  groupid:this.groupCombo.getValue(),
                 // employeeid:this.employeeCombo.getValue(),    
                  selectFromDate:fromDt,
                  selectToDate:toDt
           };
          this.auditStore.load({
            params: {
                start:0,                
                limit:this.pP.combo.value               
               } 
            });
          
        },
        resetHandler: function() {
        	this.groupCombo.setValue('');
        	this.groupCombo.clearValue();
        	//this.employeeCombo.setValue('');
        	//this.employeeCombo.clearValue();
        	this.selectFromDate.setValue("");
        	this.selectToDate.setValue("");
        	this.auditStore.baseParams = {
        			mode:41,
                    groupid:this.groupCombo.getValue(),
                  //  employeeid:this.employeeCombo.getValue(),
                    selectFromDate:this.selectFromDate.getValue(),
                    selectToDate:this.selectToDate.getValue()
            };
            this.auditStore.load({
              params: {
                  start:0,
                  limit:this.pP.combo.value
                 } 
              });
          },
          exportHandler: function() {
        	  
        	  var i,k=1, headStore,param;
        	  var column = this.grid.getColumnModel();
        	  headStore = new Array();
        	  for(i=1 ; i<column.getColumnCount() ; i++) { // skip row numberer
        		  if(column.isHidden(i)==undefined && column.getColumnHeader(i)!=""){
          		    headStore[headStore.length] = column.getColumnHeader(i);        			  
        		  }
        	  }
            var A = "Common/Reports/exportMyReportData.common?"
								+ Wtf.urlEncode(Wtf.urlDecode("headers="
										+ headStore.toString()));
            Wtf.get("downloadframe").dom.src = A
              
        }

});

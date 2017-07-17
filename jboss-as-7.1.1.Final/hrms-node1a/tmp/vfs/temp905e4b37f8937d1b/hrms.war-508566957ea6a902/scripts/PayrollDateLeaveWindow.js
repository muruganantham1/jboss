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
Wtf.leavem.PayrollDateLeaveWindow = function(config) {
    Wtf.apply(this, config);
    Wtf.leavem.PayrollDateLeaveWindow.superclass.constructor.call(this, config);
};

Wtf.extend(Wtf.leavem.PayrollDateLeaveWindow, Wtf.Window, {
    initComponent: function() {
        Wtf.leavem.PayrollDateLeaveWindow.superclass.initComponent.call(this);

    },
    onRender: function(config) {
            Wtf.leavem.PayrollDateLeaveWindow.superclass.onRender.call(this, config);
            this.createLeavetypeAdjGrid();
            var formItems = Array();

            this.adjLeavesPanel	 = new Wtf.Panel({
			frame: true,
			border: false,
                        scope:this,
			layout: 'fit',
			items: [{
                                border:false,
                                layout:'border',
				items: [{
					region : 'north',
                                        height : 80,
                                        border : false,
                                        bodyStyle : 'background:white;border-bottom:1px solid #bfbfbf;',
					html: getTopHtml( WtfGlobal.getLocaleText("hrms.payroll.Unpaidleaves"),WtfGlobal.getLocaleText("hrms.payroll.Fillthenoofunpaidleavesforrespectiveusers"))
                                    },{
					border:false,
					region:'center',
					bodyStyle : 'background:#f1f1f1;font-size:10px;',
					layout:'fit',
					items: [this.typeGrid]
                                    }
                                ]
			}],
			buttonAlign: 'right',
			buttons:[{
				text: WtfGlobal.getLocaleText("hrms.common.submit"),
				handler: function(){
					this.payrollDateLeaveWindow.submitpayrollDateLeaveWindow(this.LeavetypeAdjStore, this.emparr);
					this.close();
				},
				scope: this
			},{
				text: WtfGlobal.getLocaleText("hrms.common.cancel"),
				handler: function(){
					this.close();
				},
				scope: this
			}]
        });
        this.add(this.adjLeavesPanel);
   },
  
    
   createLeavetypeAdjGrid: function(){

        this.LeavetypeAdjStore = new Wtf.data.SimpleStore({
		   fields: ['userid', 'ename', 'unpaidleaves'],
		   data: this.storeData
       });

       this.cm = new Wtf.grid.ColumnModel([
		   {
                        header:  WtfGlobal.getLocaleText("hrms.common.employee.name"),
                        dataIndex: 'ename'
		   },{
                        header: WtfGlobal.getLocaleText("hrms.payroll.Unpaidleaves"),
                        dataIndex: 'unpaidleaves',
                        align: 'right',
                        editor: new Wtf.form.NumberField({
                                allowBlank: false,
                                maxValue: 30,
                                allowNegative:false
                        })
		   }
	   ]);

       this.LeavetypeAdjStore.on('load',function(){
           Wtf.MsgClose();
       },this);

       this.LeavetypeAdjStore.on('beforeload',function(){
           msgBoxShow(35, 4, 5, true);
       },this);

       this.LeavetypeAdjStore.on('loadexception',function(){
           Wtf.MsgClose();
       },this);

       this.sm2 = new Wtf.grid.RowSelectionModel({width:25,singleSelect:true});

		this.typeGrid = new Wtf.grid.EditorGridPanel({
			store: this.LeavetypeAdjStore,
			cm: this.cm,
			sm:this.sm2,
			loadMask : true,
			layout:'fit',
			viewConfig: {
				forceFit: true
			},
			clicksToEdit: 1
		});
   }
});

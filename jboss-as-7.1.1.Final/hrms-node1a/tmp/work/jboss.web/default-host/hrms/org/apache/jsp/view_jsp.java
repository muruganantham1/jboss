package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class view_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=UTF-8");
      response.addHeader("X-Powered-By", "JSP/2.2");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n");
      out.write("\r\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\r\n");
      out.write("\t<head>\r\n");
      out.write("\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("\t\t<title id=\"Deskerahrmstitle\">YTLC HRMS</title>\r\n");
      out.write("        <link rel=\"icon\" href=\"http://www.xchanging.com/favicon.ico\" type=\"image/x-icon\">\r\n");
      out.write("\t\t<link href='http://fonts.googleapis.com/css?family=Monda:400,700' rel='stylesheet' type='text/css'>\r\n");
      out.write("        \r\n");
      out.write("\t\t<script type=\"text/javascript\">\r\n");
      out.write("\t\t/*<![CDATA[*/\r\n");
      out.write("\t\t\tfunction _r(url){ window.top.location.href = url;}\r\n");
      out.write("\t\t/*]]>*/\r\n");
      out.write("\t\t</script>\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t\r\n");
      out.write("<!-- css -->\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"lib/resources/css/wtf-all.css\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"style/view.css?v=3\"/>\r\n");
      out.write("                <link rel=\"stylesheet\" type=\"text/css\" href=\"style/ImportWizard.css?v=3\"/>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"style/portal.css?v=3\"/>\r\n");
      out.write("        <link rel = \"stylesheet\" type = \"text/css\" href = \"style/orgChart.css\"></link>\r\n");
      out.write("        <link rel = \"stylesheet\" type = \"text/css\" href = \"style/chart.css\"></link>\r\n");
      out.write("        <link rel=\"stylesheet\" type=\"text/css\" href=\"style/dashboardstyles.css?v=3\"/>\r\n");
      out.write("\t<!--[if lte IE 6]>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"style/ielte6hax.css\" />\r\n");
      out.write("\t<![endif]-->\r\n");
      out.write("\t<!--[if IE 7]>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"style/ie7hax.css\" />\r\n");
      out.write("\t<![endif]-->\r\n");
      out.write("\t<!--[if IE 8]>\r\n");
      out.write("\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"style/ie8hax.css\" />\r\n");
      out.write("\t<![endif]-->\r\n");
      out.write("\t\r\n");
      out.write("<!-- /css -->\r\n");
      out.write("\t\t<link rel=\"shortcut icon\" href=\"http://www.xchanging.com/favicon.ico\"/>\r\n");
      out.write("\t</head>\r\n");
      out.write("\t<body>\r\n");
      out.write("\t\t<div id=\"loading-mask\" style=\"width:100%;height:100%;background:#EEE;position:absolute;z-index:20000;left:0;top:0;\">&#160;</div>\r\n");
      out.write("\t\t<div id=\"loading\">\r\n");
      out.write("\t\t\t<div class=\"loading-indicator\"><img src=\"images/loading.gif\" style=\"width:16px;height:16px; vertical-align:middle\" alt=\"Loading\" />&#160;Loading...</div>\r\n");
      out.write("\t\t</div>\r\n");
      out.write("<!-- js -->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"lib/adapter/wtf/wtf-base.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"lib/wtf-all-debug.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"props/wtf-lang-locale.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"props/msgs/messages.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfKWLJsonReader.js\"></script>\r\n");
      out.write("                \r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/WtfGlobal.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/WtfSettings.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfListPanel.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/WtfChannel.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/WtfMain-ex.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/core/WtfBindBase.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/core/WtfBind.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/WtfCustomPanel.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/common/KwlEditorGrid.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/QuickSearch.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/Select.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/KwlGridPanel.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/KWLTagSearch.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfPaging.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/WtfPagingMemProxy.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfPagingPlugin.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/KwlPagingEditorGrid.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfEditorPaging.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfEditorPagingPlugin.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/editorSearch.js\"></script>\t\t\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfGridSummary.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/WtfLibOverride.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/WtfGroupSummary.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfUpdateProfile.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfCalSettings.js\"></script>\t\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/ExportInterface.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfProjectFeatures.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfCreateUser.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfPermissions.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfUserGrid.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfAdminControl.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfAuditTrail.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfReports.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfSummaryReports.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfMyTeamReports.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfMyReports.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/WtfGridView.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/DetailPanel.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfAddComment.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/WtfComboBox.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/comboPlugin.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/WtfGetDocsAndCommentList.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/common/MultiGrouping.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/crmcommon/WtfCommonFunction.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/importInterface.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/crmcommon/WtfTextField.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/UserManagement.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/crmcommon/BufferView.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/crmcommon/gContact.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/crmcommon/WtfCrmCommonFunction.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/crmcommon/WtfClosableTab.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/crmcommon/WtfNotify.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/advanceSearch.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/common/attributeComponent.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/adminMaster/masterConfiguration.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/adminMaster/AddEditMaster.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/adminMaster/appraisalCycleMaster.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/adminMaster/configanything.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/adminMaster/AddCostCenter.js?v=3\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/adminMaster/AddProject.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/editor/newEmailTemplate.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/HrmsMain.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/PayrollDateLeaveWindow.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/GeneratePayrollProcess.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/PayrollResourceGrid.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/EmployeePayrollData.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/competencyEval.js\"></script>\t\t\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/AppraisalManagement.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/assignCompetency.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/CompetencyWindow.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/managecompetencyWindow.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/manageCompetency.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/Allemployeesforgoals.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/finalScore.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/FinalReport.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/goalComment.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/goalforemployee.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/myGoals.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/amchart.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/archivedGoals.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/approvalWindow.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/AppraisalReport.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/editor/campaignDetails.js\"></script>\r\n");
      out.write("        <!--script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/GoalMasterConfiguration/viewAppraisal.js\"></script-->\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/timesheet.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/timesheetemployee.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/timesheetemployee.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/viewtimesheets.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/timesheethistory.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/AccGridComp.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/WtfAttendanceInfopanel.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/Timesheet/TimesheetReport.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/recruitmentjobsearch.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/recruitmentjobstatus.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/CreateApplicant.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/createapplicantForm.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/jobProfile.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/ApplicationsList.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/InternalJobBoard.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/agencyWindow.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/recruitmentAgencies.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/rejectedapps.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/jobmaster2.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/editprospect.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/allApplications.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/addjobs.js\"></script>\t\t\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/interviewwindow.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/editprospect.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/qualifiedapps.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/recruiters.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/viewApplicants.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/configRecruitment.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/reportBuilder/builder.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/reportBuilder/reportForm.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/reportBuilder/selectTemplateWin.js\"></script>\t\r\n");
      out.write("        \r\n");
      out.write("        <!-- date based payroll js -->\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/datePayroll/TaxDeclarationForm.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/datePayroll/datePayComponentSetting.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/datePayroll/AddPayrollComponent.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/datePayroll/assignComponentWin.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/datePayroll/ResourcePayslip.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/datePayroll/ProcessPayrollWin.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/datePayroll/MyPayslip.js\"></script>\r\n");
      out.write("        <!-- Organization scripts -->\r\n");
      out.write("        <script src=\"scripts/OrgChart/WtfChartNode.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <script src=\"scripts/OrgChart/WtfUnmappedContainer.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <script src=\"scripts/OrgChart/WtfChartContainer.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <script src=\"scripts/OrgChart/WtfChartDragPlugin.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <!-- template based payroll js -->\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/AddIncometaxWin.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/PayCompoSetting.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/viewmypayslip.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/GenSalaryReport.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/default/WtfDefaultManager.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/AddPayrollTemplate.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/WageEntryForm.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/payroll/EmployerContributionForm.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/PayrollGroupTemplate.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/DeducEntryForm.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/UnauthorizePayrollWin.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/MalaysianStatutoryFormApprovalWin.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/MalaysianUserIncomeTaxForm.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/MalaysianUserIncomeTax.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/MalaysianCompanyStatutoryFromDetail.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/TaxEntryForm.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/GeneratePayroll.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/EmpPayslip.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/AddWTDWindow.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/PayslipGrid.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/EditViewTemplate.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/AssignEmployeeFromTemplate.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/TempEmpMaster.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/payroll/CPFSetting.js\"></script>\r\n");
      out.write("                <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/ESS/myProfile.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/ESS/employeemanagement.js?v=3\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/ESS/assignReviewer.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/ESS/fileupload.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/ESS/terminationWindow.js?v=3\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/ESS/ex-employee.js?v=3\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/ESS/employeeReports.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/Employee/passwordwindow.js\"></script>\r\n");
      out.write("\t\t<script type=\"text/javascript\" src=\"scripts/alerts/WtfComAlert.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/alerts/ResponseAlert.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/editor/compaignEmailTemplate.js\"></script>\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/payroll/userPayCycleGrid.js\"></script>\r\n");
      out.write("\r\n");
      out.write("        <script type=\"text/javascript\" src=\"scripts/DeskeraHRMS/RecruitmentManagement/letterSenderWindow.js\"></script>\t\t\r\n");
      out.write("       <!-- <script type=\"text/javascript\" src=\"scripts/payroll/payrollReports/componentList.js\"></script>  -->\r\n");
      out.write("\t\t<script type=\"text/javascript\">\r\n");
      out.write("\t\t/*<![CDATA[*/\r\n");
      out.write("\t\t\tPostProcessLoad = function(){\r\n");
      out.write("\t\t\t\tsetTimeout(function(){Wtf.get('loading').remove(); Wtf.get('loading-mask').fadeOut({remove: true});}, 250);\r\n");
      out.write("\t\t\t\tWtf.EventManager.un(window, \"load\", PostProcessLoad);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tWtf.EventManager.on(window, \"load\", PostProcessLoad);\r\n");
      out.write("\t\t/*]]>*/\r\n");
      out.write("\t\t</script>\r\n");
      out.write("<!-- /js -->\r\n");
      out.write("<!-- html -->\r\n");
      out.write("\t\t<div id=\"header\" style=\"position: relative;\">\r\n");
      out.write("\t\t\t  <img id=\"companyLogo\" src=\"http://apps.deskera.com/b/");
      out.print(com.krawler.common.util.URLUtil.getDomainName(request));
      out.write("/images/store/?company=true\" alt=\"logo\"/>\r\n");
      out.write("                        <!--img src=\"images/hrms-right-logo.gif\" alt=\"hrms\" style=\"float:left;margin-left:4px;margin-top:1px;\"/-->\r\n");
      out.write("\r\n");
      out.write("\t\t\t<div id=\"userinfo\" class=\"userinfo\">\r\n");
      out.write("\t\t\t\t<span id=\"whoami\"></span><br /><a id=\"whoami_sign_out\" href=\"#\" onclick=\"signOut('signout');\"></a>&nbsp;&nbsp;<a id=\"whoami_show_person_profile\" href=\"#\" onclick=\"showPersnProfile();\"></a>&nbsp;&nbsp;<a id=\"myProfile\" href=# onclick='myProfile()'></a>&nbsp;&nbsp;<a  href=\"#\"  id=\"organisationlink\" onclick=\"loadOrganizationPage();\"></a>\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t\t<div id=\"serchForIco\"></div>\r\n");
      out.write("\t\t\t<div id=\"searchBar\"></div>\r\n");
      out.write("\t\t\t<div id=\"shortcuts\" class=\"shortcuts\">\r\n");
      out.write("                            <div id=\"shortcutmenu1\"style=\"float:right !important;position: relative;display:inline;\"></div>\r\n");
      out.write("\t\t\t</div>\r\n");
      out.write("\t\t</div>\r\n");
      out.write("\t\t<div id='centerdiv'></div>\r\n");
      out.write("\t\t<div style=\"display:none;\">\r\n");
      out.write("\t\t\t<iframe id=\"downloadframe\"></iframe>\r\n");
      out.write("\t\t</div>\r\n");
      out.write("        <input id=\"cursor_bin\" type=\"text\" style=\"display:none;\"/>\r\n");
      out.write("<!-- /html -->\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\t</body>\r\n");
      out.write("\t\r\n");
      out.write("</html>\r\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}

package org.apache.jsp.WEB_002dINF.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class favourites_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fform_005fform_0026_005fmodelAttribute_005fmethod_005faction;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fform_005fform_0026_005fmodelAttribute_005fmethod_005faction = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fform_005fform_0026_005fmodelAttribute_005fmethod_005faction.release();
    _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.release();
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
      response.setContentType("text/html");
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
      out.write("\r\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n");
      out.write("<head>\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("<title>List Box Populate</title>\r\n");
      out.write("<script type=\"text/javascript\" src=\"lib/jquery-1.2.2.min.js\"></script>\r\n");
      out.write("<script language=\"javascript\" type=\"text/javascript\">\r\n");

if(session.getAttribute("companyid")==null){
	
	
      out.write("\r\n");
      out.write("\talert('Session Expired. Relogin to launch Favourites');\r\n");
      out.write("\twindow.close();\r\n");
      out.write("\t");

}

      out.write("\r\n");
      out.write("\r\n");
      out.write("/* Team List \r\n");
      out.write("function move_team_items(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\" option:selected\").appendTo(\"#\"+destinationid);\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("function move_team_items_all(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\" option\").appendTo(\"#\"+destinationid);\r\n");
      out.write("}\r\n");
      out.write("*/\r\n");
      out.write("    \r\n");
      out.write("\t\r\n");
      out.write("/* Work Package List */\r\n");
      out.write("\r\n");
      out.write("function move_workpkg_items(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\"  option:selected\").appendTo(\"#\"+destinationid);\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("function move_workpkg_items_all(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\" option\").appendTo(\"#\"+destinationid);\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("/* Diverted Tasks/Lost Time \r\n");
      out.write("   \r\n");
      out.write("function move_diverted_items(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\"  option:selected\").appendTo(\"#\"+destinationid);\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("function move_diverted_items_all(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\" option\").appendTo(\"#\"+destinationid);\r\n");
      out.write("} \r\n");
      out.write("*/\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("/* Project */\r\n");
      out.write("\r\n");
      out.write("function move_project_items(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\"  option:selected\").appendTo(\"#\"+destinationid);\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("function move_project_items_all(sourceid, destinationid)\r\n");
      out.write("{\r\n");
      out.write("$(\"#\"+sourceid+\" option\").appendTo(\"#\"+destinationid);\r\n");
      out.write("} \t\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\t\r\n");
      out.write("</script>\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<style type=\"text/css\">\r\n");
      out.write("\r\n");
      out.write("body{\r\n");
      out.write("\tbackground: url(\"images/img01.gif\") repeat scroll 0 0 transparent;\r\n");
      out.write("\tcolor: #787878;\r\n");
      out.write("\tfont-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;\r\n");
      out.write("\tfont-size: 8pt;\r\n");
      out.write("\theight: 100%;\r\n");
      out.write("\tmargin: 20px 0 20px 20px;\r\n");
      out.write("\tpadding: 0;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("select {\r\n");
      out.write("\twidth:200px;\r\n");
      out.write("\theight:120px;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("#main{\r\n");
      out.write("\twidth:600px;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("#main #title{\r\n");
      out.write("\tcolor: #033567;\r\n");
      out.write("    font-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;\r\n");
      out.write("    font-size: 18px;\r\n");
      out.write("    font-weight: bolder;\r\n");
      out.write("\ttext-align:center;\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("#main #left_list{\r\n");
      out.write("\twidth:200px; float:left;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("#left_list select, #right_list select{\r\n");
      out.write("\tfont-family:tahoma;\r\n");
      out.write("\tfont-size:11px;\r\n");
      out.write("\t} \r\n");
      out.write("\t\r\n");
      out.write("#left_list #heading, #right_list #heading{\r\n");
      out.write("\tfont-family:tahoma;\r\n");
      out.write("\tfont-size:12px;\r\n");
      out.write("\tfont-weight:bold;\r\n");
      out.write("\ttext-align:center;\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("#main #controller{\r\n");
      out.write("\twidth:200px; height:120px; float:left; text-align:center; display:block;\r\n");
      out.write("\tvertical-align:middle;\r\n");
      out.write("\tmargin:20px 0 0 0;\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("#controller .acbutton{\r\n");
      out.write("\tpadding:0 0 3px 0;\r\n");
      out.write("\t}\r\n");
      out.write("\t \r\n");
      out.write("#main #right_list{\r\n");
      out.write("\twidth:200px; float:left;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write(".formbuttonSmall {\r\n");
      out.write("    background: url(\"images/MainButton.gif\") repeat scroll center center transparent;\r\n");
      out.write("    color: #FFFFFF;\r\n");
      out.write("    cursor: pointer;\r\n");
      out.write("    font-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;\r\n");
      out.write("    font-size: 11px;\r\n");
      out.write("    font-weight: bold;\r\n");
      out.write("    padding: 1px 2px;\r\n");
      out.write("\twidth:110px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("#save_button{ width:100%; text-align:center;}\r\n");
      out.write("\r\n");
      out.write(".formbutton {\r\n");
      out.write("    background: url(\"images/MainButton.gif\") repeat scroll center center transparent;\r\n");
      out.write("   \tcolor: #FFFFFF;\r\n");
      out.write("    cursor: pointer;\r\n");
      out.write("    width:130px;\r\n");
      out.write("    height:25px;\r\n");
      out.write("    font-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;\r\n");
      out.write("    font-size: 11px;\r\n");
      out.write("    font-weight: bold;\r\n");
      out.write("    padding: 1px 2px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".clear_both{clear:both;}\r\n");
      out.write(".spacer{ height:30px;}\r\n");
      out.write(".spacer1{ height:20px;}\r\n");
      out.write(".spacer2{\r\n");
      out.write("color:  #033567;\r\n");
      out.write("height:30px;\r\n");
      out.write("     cursor: pointer;\r\n");
      out.write("    font-family: tahoma;\r\n");
      out.write("    font-size: 15px;\r\n");
      out.write("\t padding: 1px 2px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("</style>\r\n");
      out.write("\r\n");
      out.write("</head>\r\n");
      out.write("\r\n");
      out.write("<body>\r\n");
      if (_jspx_meth_form_005fform_005f0(_jspx_page_context))
        return;
      out.write("\r\n");
      out.write("</body>\r\n");
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

  private boolean _jspx_meth_form_005fform_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  form:form
    org.springframework.web.servlet.tags.form.FormTag _jspx_th_form_005fform_005f0 = (org.springframework.web.servlet.tags.form.FormTag) _005fjspx_005ftagPool_005fform_005fform_0026_005fmodelAttribute_005fmethod_005faction.get(org.springframework.web.servlet.tags.form.FormTag.class);
    _jspx_th_form_005fform_005f0.setPageContext(_jspx_page_context);
    _jspx_th_form_005fform_005f0.setParent(null);
    // /WEB-INF/jsp/favourites.jsp(180,0) name = modelAttribute type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fform_005f0.setModelAttribute("userJobBean");
    // /WEB-INF/jsp/favourites.jsp(180,0) name = method type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fform_005f0.setMethod("POST");
    // /WEB-INF/jsp/favourites.jsp(180,0) name = action type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fform_005f0.setAction("savejob.usr");
    int[] _jspx_push_body_count_form_005fform_005f0 = new int[] { 0 };
    try {
      int _jspx_eval_form_005fform_005f0 = _jspx_th_form_005fform_005f0.doStartTag();
      if (_jspx_eval_form_005fform_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
        do {
          out.write("\r\n");
          out.write("<div id=\"main\">\r\n");
          out.write("<div id=\"title\">Favourites Selection</div>\r\n");
          out.write("\r\n");
          out.write("\r\n");
          out.write("<!-- Work Package selection list (LEFT) starts here -->\r\n");
          out.write("<div id=\"left_list\">\r\n");
          out.write("<div id=\"heading\">Work Package</div>\r\n");
          out.write("\r\n");
          out.write("     ");
          if (_jspx_meth_form_005fselect_005f0(_jspx_th_form_005fform_005f0, _jspx_page_context, _jspx_push_body_count_form_005fform_005f0))
            return true;
          out.write("\r\n");
          out.write("</div>\r\n");
          out.write("<!-- Work Package selection list (LEFT) ends here -->\r\n");
          out.write("\r\n");
          out.write("<!-- Work Package Selection List's Controller -->\r\n");
          out.write("<div id=\"controller\">\r\n");
          out.write("<div class=\"acbutton\">&nbsp;\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">\r\n");
          out.write("<input id=\"moveright\" class=\"formbuttonSmall\" type=\"button\" value=\"Add >\" onclick=\"move_workpkg_items('from_select_list_workpkg','to_select_list_workpkg');\" />\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">&nbsp;\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">\r\n");
          out.write("<input id=\"moveleft\" class=\"formbuttonSmall\" type=\"button\" value=\"< Remove\" onclick=\"move_workpkg_items('to_select_list_workpkg','from_select_list_workpkg');\" />\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">\r\n");
          out.write("</div>\r\n");
          out.write("\r\n");
          out.write("</div>\r\n");
          out.write("\r\n");
          out.write("<!-- Work Package Selection list's Controller ends -->\r\n");
          out.write("\r\n");
          out.write("<!-- Work Package selection list (RIGHT) starts here -->\r\n");
          out.write("<div id=\"right_list\">\r\n");
          out.write("<div id=\"heading\">Favourite Work Package</div>\r\n");
          out.write("     ");
          if (_jspx_meth_form_005fselect_005f1(_jspx_th_form_005fform_005f0, _jspx_page_context, _jspx_push_body_count_form_005fform_005f0))
            return true;
          out.write("\r\n");
          out.write("</div>\r\n");
          out.write("<!-- Work Package selection list (RIGHT) ends here -->\r\n");
          out.write("<!-- ************************************************************************* -->\r\n");
          out.write("\r\n");
          out.write("<div class=\"clear_both\"></div>\r\n");
          out.write("<div class=\"spacer\"></div>\r\n");
          out.write("\r\n");
          out.write("\r\n");
          out.write("\r\n");
          out.write("<!-- ************************************************************************* -->\r\n");
          out.write("\r\n");
          out.write("<!-- Project selection list (LEFT) starts here -->\r\n");
          out.write("<div id=\"left_list\">\r\n");
          out.write("<div id=\"heading\">Project</div>\r\n");
          out.write(" ");
          if (_jspx_meth_form_005fselect_005f2(_jspx_th_form_005fform_005f0, _jspx_page_context, _jspx_push_body_count_form_005fform_005f0))
            return true;
          out.write("\r\n");
          out.write("    \r\n");
          out.write("</div>\r\n");
          out.write("<!-- Project selection list (LEFT) ends here -->\r\n");
          out.write("\r\n");
          out.write("<!-- Project Selection List's Controller -->\r\n");
          out.write("<div id=\"controller\">\r\n");
          out.write("<div class=\"acbutton\">&nbsp;\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">\r\n");
          out.write("<input id=\"moveright\" class=\"formbuttonSmall\" type=\"button\" value=\"Add >\" onclick=\"move_project_items('from_select_list_project','to_select_list_project');\" />\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">&nbsp;\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">\r\n");
          out.write("<input id=\"moveleft\" class=\"formbuttonSmall\" type=\"button\" value=\"< Remove\" onclick=\"move_project_items('to_select_list_project','from_select_list_project');\" />\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"acbutton\">\r\n");
          out.write("</div>\r\n");
          out.write("</div>\r\n");
          out.write("\r\n");
          out.write("<!-- Project Selection list's Controller ends -->\r\n");
          out.write("\r\n");
          out.write("<!-- Project selection list (RIGHT) starts here -->\r\n");
          out.write("<div id=\"right_list\">\r\n");
          out.write("<div id=\"heading\">Favourite Project</div>\r\n");
          out.write("  \r\n");
          out.write("  ");
          if (_jspx_meth_form_005fselect_005f3(_jspx_th_form_005fform_005f0, _jspx_page_context, _jspx_push_body_count_form_005fform_005f0))
            return true;
          out.write("\r\n");
          out.write("</div>\r\n");
          out.write("<!-- Project selection list (RIGHT) ends here -->\r\n");
          out.write("<!-- ************************************************************************* -->\r\n");
          out.write("\r\n");
          out.write("<div class=\"clear_both\"></div>\r\n");
          out.write("<div class=\"spacer1\"></div>\r\n");
          out.write("<div class=\"spacer2\">\r\n");
          out.write("<center>");
          out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${massege}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
          out.write("</center>\r\n");
          out.write("</div>\r\n");
          out.write("<div class=\"spacer1\"></div>\r\n");
          out.write("\r\n");
          out.write("\r\n");
          out.write("<div id=\"save_button\">\r\n");
          out.write("<input type=\"submit\" class=\"formbutton submitButton\" value=\"Save\" id=\"favourites_0\"><input type=\"button\" class=\"formbutton submitButton\" name=\"cancel\" value=\"Close\" onClick= \"javascript:window.close();\"/>\r\n");
          out.write("\r\n");
          out.write("</div>\r\n");
          out.write("\r\n");
          out.write("</div>\r\n");
          out.write("\r\n");
          out.write("<script type=\"text/javascript\">\r\n");
          out.write("    function GetSelected() {\r\n");
          out.write("\t\t//var teamSelect = $(\"#to_select_list_team\").val();\r\n");
          out.write("\t\t//var teamSelect_txt = $(\"#to_select_list_team\").text();\r\n");
          out.write("\t\tvar workPkg = $(\"#to_select_list_workpkg\").val();\r\n");
          out.write("\t\t//var divTask = $(\"#to_select_list_diverted\").val();\r\n");
          out.write("\t\tvar proj = $(\"#to_select_list_project\").val();\r\n");
          out.write("\t\t\r\n");
          out.write("\t\tvar favSelectItem =  workPkg + \" and \" + proj;\r\n");
          out.write("\t\talert(favSelectItem);\r\n");
          out.write("\t}\r\n");
          out.write(" \r\n");
          out.write("</script>\r\n");
          out.write("\r\n");
          int evalDoAfterBody = _jspx_th_form_005fform_005f0.doAfterBody();
          if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
            break;
        } while (true);
      }
      if (_jspx_th_form_005fform_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_form_005fform_005f0[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_form_005fform_005f0.doCatch(_jspx_exception);
    } finally {
      _jspx_th_form_005fform_005f0.doFinally();
      _005fjspx_005ftagPool_005fform_005fform_0026_005fmodelAttribute_005fmethod_005faction.reuse(_jspx_th_form_005fform_005f0);
    }
    return false;
  }

  private boolean _jspx_meth_form_005fselect_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_form_005fform_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_form_005fform_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  form:select
    org.springframework.web.servlet.tags.form.SelectTag _jspx_th_form_005fselect_005f0 = (org.springframework.web.servlet.tags.form.SelectTag) _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.get(org.springframework.web.servlet.tags.form.SelectTag.class);
    _jspx_th_form_005fselect_005f0.setPageContext(_jspx_page_context);
    _jspx_th_form_005fselect_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_form_005fform_005f0);
    // /WEB-INF/jsp/favourites.jsp(189,5) name = path type = null reqTime = true required = true fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f0.setPath("fromWorkpkg");
    // /WEB-INF/jsp/favourites.jsp(189,5) name = id type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f0.setId("from_select_list_workpkg");
    // /WEB-INF/jsp/favourites.jsp(189,5) name = multiple type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f0.setMultiple(new String("true"));
    // /WEB-INF/jsp/favourites.jsp(189,5) name = items type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f0.setItems((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${subProjects}", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int[] _jspx_push_body_count_form_005fselect_005f0 = new int[] { 0 };
    try {
      int _jspx_eval_form_005fselect_005f0 = _jspx_th_form_005fselect_005f0.doStartTag();
      if (_jspx_th_form_005fselect_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_form_005fselect_005f0[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_form_005fselect_005f0.doCatch(_jspx_exception);
    } finally {
      _jspx_th_form_005fselect_005f0.doFinally();
      _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.reuse(_jspx_th_form_005fselect_005f0);
    }
    return false;
  }

  private boolean _jspx_meth_form_005fselect_005f1(javax.servlet.jsp.tagext.JspTag _jspx_th_form_005fform_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_form_005fform_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  form:select
    org.springframework.web.servlet.tags.form.SelectTag _jspx_th_form_005fselect_005f1 = (org.springframework.web.servlet.tags.form.SelectTag) _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.get(org.springframework.web.servlet.tags.form.SelectTag.class);
    _jspx_th_form_005fselect_005f1.setPageContext(_jspx_page_context);
    _jspx_th_form_005fselect_005f1.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_form_005fform_005f0);
    // /WEB-INF/jsp/favourites.jsp(215,5) name = path type = null reqTime = true required = true fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f1.setPath("toWorkpkg");
    // /WEB-INF/jsp/favourites.jsp(215,5) name = id type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f1.setId("to_select_list_workpkg");
    // /WEB-INF/jsp/favourites.jsp(215,5) name = multiple type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f1.setMultiple(new String("true"));
    // /WEB-INF/jsp/favourites.jsp(215,5) name = items type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f1.setItems((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${subNewProjects}", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int[] _jspx_push_body_count_form_005fselect_005f1 = new int[] { 0 };
    try {
      int _jspx_eval_form_005fselect_005f1 = _jspx_th_form_005fselect_005f1.doStartTag();
      if (_jspx_th_form_005fselect_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_form_005fselect_005f1[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_form_005fselect_005f1.doCatch(_jspx_exception);
    } finally {
      _jspx_th_form_005fselect_005f1.doFinally();
      _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.reuse(_jspx_th_form_005fselect_005f1);
    }
    return false;
  }

  private boolean _jspx_meth_form_005fselect_005f2(javax.servlet.jsp.tagext.JspTag _jspx_th_form_005fform_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_form_005fform_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  form:select
    org.springframework.web.servlet.tags.form.SelectTag _jspx_th_form_005fselect_005f2 = (org.springframework.web.servlet.tags.form.SelectTag) _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.get(org.springframework.web.servlet.tags.form.SelectTag.class);
    _jspx_th_form_005fselect_005f2.setPageContext(_jspx_page_context);
    _jspx_th_form_005fselect_005f2.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_form_005fform_005f0);
    // /WEB-INF/jsp/favourites.jsp(230,1) name = path type = null reqTime = true required = true fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f2.setPath("fromProject");
    // /WEB-INF/jsp/favourites.jsp(230,1) name = id type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f2.setId("from_select_list_project");
    // /WEB-INF/jsp/favourites.jsp(230,1) name = multiple type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f2.setMultiple(new String("true"));
    // /WEB-INF/jsp/favourites.jsp(230,1) name = items type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f2.setItems((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${projects}", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int[] _jspx_push_body_count_form_005fselect_005f2 = new int[] { 0 };
    try {
      int _jspx_eval_form_005fselect_005f2 = _jspx_th_form_005fselect_005f2.doStartTag();
      if (_jspx_th_form_005fselect_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_form_005fselect_005f2[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_form_005fselect_005f2.doCatch(_jspx_exception);
    } finally {
      _jspx_th_form_005fselect_005f2.doFinally();
      _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.reuse(_jspx_th_form_005fselect_005f2);
    }
    return false;
  }

  private boolean _jspx_meth_form_005fselect_005f3(javax.servlet.jsp.tagext.JspTag _jspx_th_form_005fform_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_form_005fform_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  form:select
    org.springframework.web.servlet.tags.form.SelectTag _jspx_th_form_005fselect_005f3 = (org.springframework.web.servlet.tags.form.SelectTag) _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.get(org.springframework.web.servlet.tags.form.SelectTag.class);
    _jspx_th_form_005fselect_005f3.setPageContext(_jspx_page_context);
    _jspx_th_form_005fselect_005f3.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_form_005fform_005f0);
    // /WEB-INF/jsp/favourites.jsp(257,2) name = path type = null reqTime = true required = true fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f3.setPath("toProject");
    // /WEB-INF/jsp/favourites.jsp(257,2) name = id type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f3.setId("to_select_list_project");
    // /WEB-INF/jsp/favourites.jsp(257,2) name = multiple type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f3.setMultiple(new String("true"));
    // /WEB-INF/jsp/favourites.jsp(257,2) name = items type = null reqTime = true required = false fragment = false deferredValue = false deferredMethod = false expectedTypeName = null methodSignature = null 
    _jspx_th_form_005fselect_005f3.setItems((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${newProjects}", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int[] _jspx_push_body_count_form_005fselect_005f3 = new int[] { 0 };
    try {
      int _jspx_eval_form_005fselect_005f3 = _jspx_th_form_005fselect_005f3.doStartTag();
      if (_jspx_th_form_005fselect_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_form_005fselect_005f3[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_form_005fselect_005f3.doCatch(_jspx_exception);
    } finally {
      _jspx_th_form_005fselect_005f3.doFinally();
      _005fjspx_005ftagPool_005fform_005fselect_0026_005fpath_005fmultiple_005fitems_005fid_005fnobody.reuse(_jspx_th_form_005fselect_005f3);
    }
    return false;
  }
}

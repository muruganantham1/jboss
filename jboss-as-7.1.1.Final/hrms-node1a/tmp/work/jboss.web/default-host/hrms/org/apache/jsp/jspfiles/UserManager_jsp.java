package org.apache.jsp.jspfiles;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.krawler.esp.database.*;
import com.krawler.utils.json.base.*;
import java.util.*;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import com.krawler.esp.handlers.*;
import com.krawler.common.locale.MessageSourceProxy;
import com.krawler.common.util.LocaleUtil;

public final class UserManager_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("/*\r\n");
      out.write(" * Copyright (C) 2012  Krawler Information Systems Pvt Ltd\r\n");
      out.write(" * All rights reserved.\r\n");
      out.write(" * \r\n");
      out.write(" * This program is free software; you can redistribute it and/or\r\n");
      out.write(" * modify it under the terms of the GNU General Public License\r\n");
      out.write(" * as published by the Free Software Foundation; either version 2\r\n");
      out.write(" * of the License, or (at your option) any later version.\r\n");
      out.write(" * \r\n");
      out.write(" * This program is distributed in the hope that it will be useful,\r\n");
      out.write(" * but WITHOUT ANY WARRANTY; without even the implied warranty of\r\n");
      out.write(" * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\r\n");
      out.write(" * GNU General Public License for more details.\r\n");
      out.write(" * \r\n");
      out.write(" * You should have received a copy of the GNU General Public License\r\n");
      out.write(" * along with this program; if not, write to the Free Software\r\n");
      out.write(" * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.\r\n");
      out.write("*/\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      com.krawler.esp.handlers.SessionHandler sessionbean = null;
      synchronized (session) {
        sessionbean = (com.krawler.esp.handlers.SessionHandler) _jspx_page_context.getAttribute("sessionbean", PageContext.SESSION_SCOPE);
        if (sessionbean == null){
          sessionbean = new com.krawler.esp.handlers.SessionHandler();
          _jspx_page_context.setAttribute("sessionbean", sessionbean, PageContext.SESSION_SCOPE);
        }
      }
      out.write('\r');
      out.write('\n');


    JSONObject jobj=new JSONObject();
    JSONObject obj=new JSONObject();
   boolean isFormSubmit = false;
    if(sessionbean.validateSession(request, response)){
        try {
            int mode;
            int start;
            int limit;
            boolean success = true;
            HashMap hm=null;
            if(ServletFileUpload.isMultipartContent(request)){
                hm=new FileUploadHandler().getItems(request);
                mode=Integer.parseInt(hm.get("mode").toString());
            }else
                mode = Integer.parseInt(request.getParameter("mode"));

            boolean isLoggable = false;
            int actiontype=0;
            String actiontext="";
            switch (mode) {
               case 1 :
                     obj=DBCon.getFeatureList(request);
                break;
               case 2 :
                     obj=DBCon.getActivityList(request);
                break;
               case 3 :
                     isFormSubmit=true;
                     DBCon.saveFeature(request);
                     obj.put("msg", "Feature has been saved successfully.");
                break;
               case 4 :
                     isFormSubmit=true;
                     DBCon.saveActivity(request);
                     obj.put("msg", "Activity has been saved successfully.");
                break;
               case 5 :
                     DBCon.deleteFeature(request);
                     obj.put("msg", "Feature has been Deleted successfully.");
                break;
               case 6 :
                     DBCon.deleteActivity(request);
                     obj.put("msg", "Activity has been Deleted successfully.");

                break;
               case 7 :
                     obj=DBCon.getPermissionCode(request);
                break;
                case 8:
                     obj=DBCon.getRoles(request);
                break;
                case 9:
                     boolean isSaved = DBCon.saveRole(request);
                     if(isSaved){
                     	obj.put("msg", MessageSourceProxy.getMessage("hrms.jsp.msg.rolehasbeensavedsuccessfully" ,null,"Role has been saved successfully.", LocaleUtil.getCompanyLocale(AuthHandler.getCompanyid(request),0)));
                     }else{
                    	 success = false;
                    	 obj.put("msg", MessageSourceProxy.getMessage("hrms.jsp.msg.role.already.exists" ,null, "Role name already exists, Please assign another role.", LocaleUtil.getCompanyLocale(AuthHandler.getCompanyid(request),0)));	 
                     }
                break;
                case 10:
                	 DBCon.deleteRole(request);
                     obj.put("msg", MessageSourceProxy.getMessage("hrms.jsp.msg.rolehasbeendeletedsuccessfully" ,null,"Role has been deleted successfully.", LocaleUtil.getCompanyLocale(AuthHandler.getCompanyid(request),0)));
                     //obj.put("msg", "Role has been deleted successfully.");
                break;
               case 11 :
                   if(request.getParameter("start")==null)
                            {
                             start=0;
                             limit=15;
                        }else{
                              start=Integer.parseInt(request.getParameter("start"));
                             limit=Integer.parseInt(request.getParameter("limit"));
                        }
                     obj=DBCon.getAllUserDetails(request,start,limit);
                break;
               case 12 :
                     isFormSubmit=true;
                     if(hm==null)throw new Exception("Form does not support file upload.");
                     obj=DBCon.saveUser(request,hm);
                break;
               case 13 :
                     DBCon.deleteUser(request);
                     obj.put("msg", "User has been Deleted successfully.");
                break;
               case 14 :
                     DBCon.setPassword(request);
                     obj.put("msg", "Password has been saved successfully.");
                break;
               case 15 :
                     DBCon.setPermissions(request);
                     obj.put("msg", "Permissions have been assigned successfully.");
                break;
               case 16 :
                     obj=DBCon.getAllTimeZones(request);
                     break;
               case 17 :
                     obj=DBCon.getAllCurrencies(request);
                break;
               case 18 :
                     obj=DBCon.getCompanyInformation(request);
                break;
               case 19 :
                     obj=DBCon.getCompanyHolidays(request);
                break;
               case 20 :
                     obj=DBCon.getAllCountries(request);
                break;
               case 21 :
                     isFormSubmit=true;
                     if(hm==null)throw new Exception("Form does not support file upload.");
                     DBCon.updateCompany(request, hm);
                     obj.put("msg", "Company has been updated successfully.");
                break;
                case 22 :
                     obj=DBCon.getManagers(request);
                break;
                case 25 :
                     isFormSubmit=true;
                     DBCon.setEmpIdFormat(request);
                break;
				case 31:
                     obj.put("data", DBCon.getPreferences(request));
                     break;
               case 32:
                     obj=DBCon.getAllDateFormats(request);
                     break;
                case 23:
                    String platformURL = this.getServletContext().getInitParameter("platformURL");
                    obj=DBCon.changepassword(platformURL,request);
                    break;
                  case 24:
                     obj=DBCon.getparticularUserDetails(request);
                    break;
               case 41:
                     obj=DBCon.getAuditTrail(request);
                     break;
               case 42:
                     obj=DBCon.getAuditGroups(request);
                     break;
                  case 111 :
                      if(request.getParameter("start")==null)
                            {
                             start=0;
                             limit=15;
                        }else{
                              start=Integer.parseInt(request.getParameter("start"));
                             limit=Integer.parseInt(request.getParameter("limit"));
                        }
                     obj=DBCon.getAllCompanyDetails(request,start,limit);
                break;
                case 112 :
                    if(request.getParameter("start")==null)
                            {
                             start=0;
                             limit=15;
                        }else{
                              start=Integer.parseInt(request.getParameter("start"));
                             limit=Integer.parseInt(request.getParameter("limit"));
                        }
                     obj=DBCon.getUserofCompany(request,start,limit);
                break;
                case 113:
                    DBCon.deletecompany(request);
                    break;
                case 114 :
                   if(request.getParameter("start")==null)
                            {
                             start=0;
                             limit=15;
                        }else{
                             start=Integer.parseInt(request.getParameter("start"));
                             limit=Integer.parseInt(request.getParameter("limit"));
                        }
                     obj=DBCon.getAllUserDetails_profile(request,start,limit);
                break;                                
                case 115 :
                   if(request.getParameter("start")==null)
                            {
                             start=0;
                             limit=15;
                        }else{
                             start=Integer.parseInt(request.getParameter("start"));
                             limit=Integer.parseInt(request.getParameter("limit"));
                        }
                     obj=DBCon.getexEmployees(request,start,limit);
                break;
                case 116 :
                   if(request.getParameter("start")==null)
                            {
                             start=0;
                             limit=15;
                        }else{
                             start=Integer.parseInt(request.getParameter("start"));
                             limit=Integer.parseInt(request.getParameter("limit"));
                        }
                     obj=DBCon.getEmpHistory(request,start,limit);
                break;
            }
            obj.put("success",success);
         } catch (Exception e) {
            obj.put("success", false);
            obj.put("msg", e.getMessage());
        } finally {
            jobj.put("valid", true);
            if(!isFormSubmit){
                jobj.put("data", obj);
            }else{
                jobj=obj;
            }
        }
    } else {
        sessionbean.destroyUserSession(request, response);
         jobj.put("valid", false);
    }

    out.println(jobj);

      out.write('\r');
      out.write('\n');
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

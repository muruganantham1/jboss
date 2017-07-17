package org.apache.jsp.jspfiles;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.krawler.common.session.SessionExpiredException;
import com.krawler.esp.handlers.AuthHandler;
import com.krawler.esp.database.hrmsDbcon;
import com.krawler.esp.handlers.PermissionHandler;
import com.krawler.utils.json.base.JSONObject;
import com.krawler.utils.json.base.JSONArray;

public final class widget_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      response.setContentType("text/html;charset=UTF-8");
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

        String message = "{\"data\":[]}";
        boolean isFormSubmit = false;
        if (sessionbean.validateSession(request, response)) {
            try {

                int flag = 0;
                JSONArray jArr = new JSONArray();
                JSONObject tempJObj = new JSONObject();
                if(request.getParameter("flag")!=null)
                    flag = Integer.parseInt(request.getParameter("flag"));
                else
                    flag = Integer.parseInt(request.getParameter("mode"));

                switch (flag) {
                    case 1: // get widgetstates
                        message = hrmsDbcon.getWidgetStatus(request);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;
                    case 2:// remove widgetstates
                        //message = hrmsDbcon.removeWidgetFromState(request);
                        message = "{\"valid\": true, \"data\":{success:true}}";
                        break;
                    case 3:// insert widgetstates
                        //message = hrmsDbcon.insertWidgetIntoState(request);
                        message = "{\"valid\": true, \"data\":{success:true}}";
                        break;
                    case 4:// change widgetstates
                        message = hrmsDbcon.changeWidgetStateOnDrop(request);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;
                    case 5:// get project updates
                        //JSONObject jobj = new JSONObject();
                        //jobj.put("data", new JSONArray());
                        //jobj.put("count", 0);
                        //message = jobj.toString();
                        message = hrmsDbcon.getUpdatesForWidgets(request);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;
                    case 6:// get Administration Links
                        message = hrmsDbcon.getDashboardLinks(request,flag);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;
                    case 7:// get Recruitment Links
                        message = hrmsDbcon.getDashboardLinks(request,flag);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;

                    case 8:// get Payroll Links
                        message = hrmsDbcon.getDashboardLinks(request,flag);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;

                    case 9:// get Timesheet Links
                        message = hrmsDbcon.getDashboardLinks(request,flag);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;
                        
                    case 10:// get Performance Links
                        message = hrmsDbcon.getDashboardLinks(request,flag);
                        message = "{\"valid\": true, \"data\":"+message+"}";
                        break;
                }
            } catch (Exception e) {
                message = "{\"success\":false,\"msg\":" + e + "}";
            } finally {
                //if(!isFormSubmit)
                //    message = "{\"valid\": true, \"data\":"+message+"}";

            }
        } else {
            message = "{'valid': false}";
        }
        out.println(message);

      out.write("\r\n");
      out.write("\r\n");
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

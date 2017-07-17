package org.apache.jsp.jspfiles;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.krawler.esp.database.payrollDBCon;
import com.krawler.utils.json.base.JSONObject;

public final class PayrollHandler_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      com.krawler.esp.handlers.SessionHandler sessionbean = null;
      synchronized (session) {
        sessionbean = (com.krawler.esp.handlers.SessionHandler) _jspx_page_context.getAttribute("sessionbean", PageContext.SESSION_SCOPE);
        if (sessionbean == null){
          sessionbean = new com.krawler.esp.handlers.SessionHandler();
          _jspx_page_context.setAttribute("sessionbean", sessionbean, PageContext.SESSION_SCOPE);
        }
      }
      out.write("\r\n");
      out.write("        ");

        if (sessionbean.validateSession(request, response)) {
            // response.setContentType("text/html;charset=UTF-8");
            try {
                String send = "fail";
                payrollDBCon rh = new payrollDBCon();
                if (request.getParameter("getcompany") != null) {
                    send = "{cname:'" + request.getSession().getAttribute("company") + "'}";
                }
                if (request.getParameter("type") != null) {
                    if (request.getParameter("type").equalsIgnoreCase("Wages") && request.getParameter("cname") == null) {
                        send = rh.getter(1, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Wages") && request.getParameter("cname") != null) {
                        send = rh.getter(2, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Tax") && request.getParameter("cname") == null) {
                        send = rh.getter(3, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Tax") && request.getParameter("cname") != null) {
                        send = rh.getter(4, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Deduction") && request.getParameter("cname") == null) {
                        send = rh.getter(5, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Deduction") && request.getParameter("cname") != null) {
                        send = rh.getter(6, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Company")) {
                        send = rh.getter(7, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Group")) {
                        if (request.getParameter("cname") != null) {
                            send = rh.getter(8, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("CPaytemp")) {
                        if (request.getParameter("TempId") != null) {
                            send = rh.getter(10, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("EmpPerTemId")) {
                        if (request.getParameter("TempId") != null) {
                            send = rh.getter(11, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("WagesperTemp")) {
                        if (request.getParameter("TempId") != null) {
                            send = rh.getter(12, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("TaxesperTemp")) {
                        if (request.getParameter("TempId") != null) {
                            send = rh.getter(13, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("DeducperTemp")) {
                        if (request.getParameter("TempId") != null) {
                            send = rh.getter(14, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("Users")) {
                        if (request.getParameter("cname") != null) {
                            send = rh.getter(15, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("Template")) {
                        if (request.getParameter("groupid") != null) {
                            send = rh.getter(16, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("audit")) {
                        if (request.getParameter("enddate") != null && request.getParameter("stdate") != null) {
                            send = rh.getter(17, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("TWages") && request.getParameter("cname") != null && request.getParameter("assign") != null) {
                        send = rh.getter(18, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("TTax") && request.getParameter("cname") != null && request.getParameter("assign") != null) {
                        send = rh.getter(19, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("TDeduction") && request.getParameter("cname") != null && request.getParameter("assign") != null) {
                        send = rh.getter(20, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("Currency")) {
                        send = rh.getter(21, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("GenerateCode")) {
                        if (request.getParameter("codetype") != null) {
                            send = rh.getter(22, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("AUsers")) {
                        if (request.getParameter("cname") != null) {
                            send = rh.getter(23, request);
                        }
                    } else if (request.getParameter("type").equalsIgnoreCase("SalaryReport")) {
                        send = rh.getter(24, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("getGroupList")) {
                        send = rh.getter(26, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("EmpListPerGroupid")) {
                        send = rh.getter(28, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("IncomeTax")) {
                        send = rh.getter(32, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("ReportPerMonth")) {
                        send = rh.getter(34, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("viewmypayslip")) {
                        send = rh.getter(35, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("HistWages")) {
                        send = rh.getter(36, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("HistTaxes")) {
                        send = rh.getter(37, request);
                    } else if (request.getParameter("type").equalsIgnoreCase("HistDeduces")) {
                        send = rh.getter(38, request);
                    }
                    else if (request.getParameter("type").equalsIgnoreCase("getPayComponent")) {
                        send = rh.getter(39, request);
                    }
                    else if (request.getParameter("type").equalsIgnoreCase("getCategory")) {
                        send = rh.getter(41, request);
                    }else if (request.getParameter("type").equalsIgnoreCase("GetTaxperCatgry")) {
                        send = rh.getter(42, request);
                    }else if (request.getParameter("type").equalsIgnoreCase("getTemplistperDesign")) {
                        send = rh.getter(43, request);
                    }else if (request.getParameter("type").equalsIgnoreCase("getDefualtWages")) {
                        send = rh.getter(44, request);
                    }else if (request.getParameter("type").equalsIgnoreCase("getDefualtDeduction")) {
                        send = rh.getter(45, request);
                    }else if (request.getParameter("type").equalsIgnoreCase("getDefualtTaxes")) {
                        send = rh.getter(46, request);
                    }else if (request.getParameter("type").equalsIgnoreCase("exportSalaryReport")) {
                        send = rh.getter(47, request);
                    }else if (request.getParameter("type").equalsIgnoreCase("GenerateSalaryList")) {
                        send = rh.getter(48, request);
                    }
                  
                } else if (request.getParameter("PayProc") != null) {
                    if (request.getParameter("PayProc").equalsIgnoreCase("get")) {
                        //send=setGroupData(request.getParameter("name"),request.getParameter("cname"));
                        send = rh.getter(9, request);//"06ecdf2d-793b-4077-b3dd-5a05b9c526f0");//c0d732bd-961e-4aa5-9447-13328d392534");
                    }
                }
                if (request.getParameter("save") != null) {
                    if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("Wage")) {
                            send = rh.setter(50, request);
                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("Tax")) {
                            send = rh.setter(51, request);
                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("Deduction")) {
                            send = rh.setter(52, request);
                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("Company")) {
                        if (request.getParameter("name").trim().length() > 0 && request.getParameter("website").trim().length() > 0 && request.getParameter("address").trim().length() > 0 && request.getParameter("currency").trim().length() > 0) {
                            send = rh.setter(53, request);

                        }

                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("Group")) {
                        if (request.getParameter("name").trim().length() > 0) {
                            send = rh.setter(54, request);
                        }

                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("Employee")) {
                        //if(request.getParameter("cid").trim().length()>0 && request.getParameter("fname").trim().length()>0&& request.getParameter("lname").trim().length()>0&& request.getParameter("design").trim().length()>0){

                        //String cid,String fname,String lname,String design,String accno,String add,String salary

                        send = rh.setter(55, request);

                    //}
                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("templatedata")) {
                        //if(request.getParameter("cid").trim().length()>0 && request.getParameter("fname").trim().length()>0&& request.getParameter("lname").trim().length()>0&& request.getParameter("design").trim().length()>0){

                        //String cid,String fname,String lname,String design,String accno,String add,String salary

                        send = rh.setter(56, request);

                    //}
                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("AssignTemp")) {
                        if (request.getParameter("tid").trim().length() > 0) {
                            send = rh.setter(57, request);//
                        }

                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("PayHistory")) {
                        if (request.getParameter("empid").trim().length() > 0 && request.getParameter("tempid").trim().length() > 0) {
                            send = rh.setter(58, request);//
                        }

                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("updatetemplatedata")) {
                        //if(request.getParameter("cid").trim().length()>0 && request.getParameter("fname").trim().length()>0&& request.getParameter("lname").trim().length()>0&& request.getParameter("design").trim().length()>0){

                        //String cid,String fname,String lname,String design,String accno,String add,String salary

                        send = rh.setter(59, request);

                    //}
                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("setFederalTax")) {
                        if (request.getParameter("jsondata").trim().length() > 0) {
                            send = rh.setter(60, request);//
                        }

                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("setIncomeTax")) {
                        if (request.getParameter("jsondata").trim().length() > 0) {
                            send = rh.setter(62, request);//
                        }

                    } else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("PayHistoryforTemp")) {
                        if (request.getParameter("TempId").trim().length() > 0) {
                            send = rh.setter(64, request);//
                        }

                    }
                    else if (request.getParameter("save").equalsIgnoreCase("true") && request.getParameter("saveType").equalsIgnoreCase("AddIncometax")) {
                            send = rh.setter(65, request);

                    }
                }
                if (request.getParameter("dele") != null) {
                    if (request.getParameter("dele").equalsIgnoreCase("true") && request.getParameter("delType").equalsIgnoreCase("template")) {
                        if (request.getParameter("tempid").trim().length() > 0) {
                            send = rh.remover(1, request);
                        }
                    }
                    if (request.getParameter("dele").equalsIgnoreCase("true") && request.getParameter("delType").equalsIgnoreCase("Tax")) {
                        if (request.getParameter("typeid").trim().length() > 0) {
                            send = rh.remover(3, request);
                        }
                    }
                    if (request.getParameter("dele").equalsIgnoreCase("true") && request.getParameter("delType").equalsIgnoreCase("IncomeTax")) {
                        if (request.getParameter("typeid").trim().length() > 0) {
                            send = rh.remover(4, request);
                        }
                    }
                    if (request.getParameter("dele").equalsIgnoreCase("true") && request.getParameter("delType").equalsIgnoreCase("Wage")) {
                        if (request.getParameter("typeid").trim().length() > 0) {
                            send = rh.remover(5, request);
                        }
                    }
                    if (request.getParameter("dele").equalsIgnoreCase("true") && request.getParameter("delType").equalsIgnoreCase("Deduction")) {
                        if (request.getParameter("typeid").trim().length() > 0) {
                            send = rh.remover(7, request);
                        }
                    }
                }
                //out.clearBuffer();
                out.print(send);
                //out.flush();

            } catch (Exception se) {
                out.print(se.getMessage());
            } finally {
                //out.close();
            }
        }
        else {
            sessionbean.destroyUserSession(request, response);
            JSONObject jobj = new JSONObject();
            jobj.put("valid", false);
            out.print(jobj.toString());
        }
    
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

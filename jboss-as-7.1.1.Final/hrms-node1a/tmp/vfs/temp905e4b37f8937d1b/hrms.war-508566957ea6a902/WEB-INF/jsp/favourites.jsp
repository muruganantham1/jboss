<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>List Box Populate</title>
<script type="text/javascript" src="lib/jquery-1.2.2.min.js"></script>
<script language="javascript" type="text/javascript">
<%
if(session.getAttribute("companyid")==null){
	
	%>
	alert('Session Expired. Relogin to launch Favourites');
	window.close();
	<%
}
%>

/* Team List 
function move_team_items(sourceid, destinationid)
{
$("#"+sourceid+" option:selected").appendTo("#"+destinationid);
}

function move_team_items_all(sourceid, destinationid)
{
$("#"+sourceid+" option").appendTo("#"+destinationid);
}
*/
    
	
/* Work Package List */

function move_workpkg_items(sourceid, destinationid)
{
$("#"+sourceid+"  option:selected").appendTo("#"+destinationid);
}

function move_workpkg_items_all(sourceid, destinationid)
{
$("#"+sourceid+" option").appendTo("#"+destinationid);
}


/* Diverted Tasks/Lost Time 
   
function move_diverted_items(sourceid, destinationid)
{
$("#"+sourceid+"  option:selected").appendTo("#"+destinationid);
}

function move_diverted_items_all(sourceid, destinationid)
{
$("#"+sourceid+" option").appendTo("#"+destinationid);
} 
*/


/* Project */

function move_project_items(sourceid, destinationid)
{
$("#"+sourceid+"  option:selected").appendTo("#"+destinationid);
}

function move_project_items_all(sourceid, destinationid)
{
$("#"+sourceid+" option").appendTo("#"+destinationid);
} 	


	
</script>




<style type="text/css">

body{
	background: url("images/img01.gif") repeat scroll 0 0 transparent;
	color: #787878;
	font-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;
	font-size: 8pt;
	height: 100%;
	margin: 20px 0 20px 20px;
	padding: 0;
	}

select {
	width:200px;
	height:120px;
	}

#main{
	width:600px;
	}

#main #title{
	color: #033567;
    font-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;
    font-size: 18px;
    font-weight: bolder;
	text-align:center;
	}
	
#main #left_list{
	width:200px; float:left;
	}

#left_list select, #right_list select{
	font-family:tahoma;
	font-size:11px;
	} 
	
#left_list #heading, #right_list #heading{
	font-family:tahoma;
	font-size:12px;
	font-weight:bold;
	text-align:center;
	}
	
#main #controller{
	width:200px; height:120px; float:left; text-align:center; display:block;
	vertical-align:middle;
	margin:20px 0 0 0;
	}
	
#controller .acbutton{
	padding:0 0 3px 0;
	}
	 
#main #right_list{
	width:200px; float:left;
	}

.formbuttonSmall {
    background: url("images/MainButton.gif") repeat scroll center center transparent;
    color: #FFFFFF;
    cursor: pointer;
    font-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;
    font-size: 11px;
    font-weight: bold;
    padding: 1px 2px;
	width:110px;
}

#save_button{ width:100%; text-align:center;}

.formbutton {
    background: url("images/MainButton.gif") repeat scroll center center transparent;
   	color: #FFFFFF;
    cursor: pointer;
    width:130px;
    height:25px;
    font-family: Arial,Frutiger LT,Times New Roman,sans-serif,serif;
    font-size: 11px;
    font-weight: bold;
    padding: 1px 2px;
}

.clear_both{clear:both;}
.spacer{ height:30px;}
.spacer1{ height:20px;}
.spacer2{
color:  #033567;
height:30px;
     cursor: pointer;
    font-family: tahoma;
    font-size: 15px;
	 padding: 1px 2px;
}

</style>

</head>

<body>
<form:form modelAttribute="userJobBean" method="POST" action="savejob.usr">
<div id="main">
<div id="title">Favourites Selection</div>


<!-- Work Package selection list (LEFT) starts here -->
<div id="left_list">
<div id="heading">Work Package</div>

     <form:select path="fromWorkpkg" id="from_select_list_workpkg" multiple="true" items="${subProjects}" />
</div>
<!-- Work Package selection list (LEFT) ends here -->

<!-- Work Package Selection List's Controller -->
<div id="controller">
<div class="acbutton">&nbsp;
</div>
<div class="acbutton">
<input id="moveright" class="formbuttonSmall" type="button" value="Add >" onclick="move_workpkg_items('from_select_list_workpkg','to_select_list_workpkg');" />
</div>
<div class="acbutton">&nbsp;
</div>
<div class="acbutton">
<input id="moveleft" class="formbuttonSmall" type="button" value="< Remove" onclick="move_workpkg_items('to_select_list_workpkg','from_select_list_workpkg');" />
</div>
<div class="acbutton">
</div>

</div>

<!-- Work Package Selection list's Controller ends -->

<!-- Work Package selection list (RIGHT) starts here -->
<div id="right_list">
<div id="heading">Favourite Work Package</div>
     <form:select path="toWorkpkg" id="to_select_list_workpkg" multiple="true" items="${subNewProjects}"  />
</div>
<!-- Work Package selection list (RIGHT) ends here -->
<!-- ************************************************************************* -->

<div class="clear_both"></div>
<div class="spacer"></div>



<!-- ************************************************************************* -->

<!-- Project selection list (LEFT) starts here -->
<div id="left_list">
<div id="heading">Project</div>
 <form:select path="fromProject" id="from_select_list_project" multiple="true" items="${projects}" />
    
</div>
<!-- Project selection list (LEFT) ends here -->

<!-- Project Selection List's Controller -->
<div id="controller">
<div class="acbutton">&nbsp;
</div>
<div class="acbutton">
<input id="moveright" class="formbuttonSmall" type="button" value="Add >" onclick="move_project_items('from_select_list_project','to_select_list_project');" />
</div>
<div class="acbutton">&nbsp;
</div>
<div class="acbutton">
<input id="moveleft" class="formbuttonSmall" type="button" value="< Remove" onclick="move_project_items('to_select_list_project','from_select_list_project');" />
</div>
<div class="acbutton">
</div>
</div>

<!-- Project Selection list's Controller ends -->

<!-- Project selection list (RIGHT) starts here -->
<div id="right_list">
<div id="heading">Favourite Project</div>
  
  <form:select path="toProject" id="to_select_list_project" multiple="true" items="${newProjects}" />
</div>
<!-- Project selection list (RIGHT) ends here -->
<!-- ************************************************************************* -->

<div class="clear_both"></div>
<div class="spacer1"></div>
<div class="spacer2">
<center>${massege}</center>
</div>
<div class="spacer1"></div>


<div id="save_button">
<input type="submit" class="formbutton submitButton" value="Save" id="favourites_0"><input type="button" class="formbutton submitButton" name="cancel" value="Close" onClick= "javascript:window.close();"/>

</div>

</div>

<script type="text/javascript">
    function GetSelected() {
		//var teamSelect = $("#to_select_list_team").val();
		//var teamSelect_txt = $("#to_select_list_team").text();
		var workPkg = $("#to_select_list_workpkg").val();
		//var divTask = $("#to_select_list_diverted").val();
		var proj = $("#to_select_list_project").val();
		
		var favSelectItem =  workPkg + " and " + proj;
		alert(favSelectItem);
	}
 
</script>

</form:form>
</body>
</html>

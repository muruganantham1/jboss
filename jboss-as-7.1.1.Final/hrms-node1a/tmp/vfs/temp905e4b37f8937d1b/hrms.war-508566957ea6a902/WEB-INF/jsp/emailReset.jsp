
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>HRMS</title>
		<style>
			body{margin:0; padding:0;}
			.bar{background:#00478f; color:#fff;padding:10px; text-align:center;font-weight:bold; font-family:arial; font-size:16px; margin:20px 0;}
			.col{padding:10px;}
			.col label{font-size:14px; font-family:arial}
			.col input[type="text"]{padding:5px; width:240px;}
			.padingLeft{padding-left: 108px;}
			.col input[type="button"]:first-child{margin-left:0}
			.col input[type="button"]{background:#009bd4; padding:5px 10px; color:#fff; font-family:arial;font-size:14px; cursor:pointer; border:none; margin-left:10px;}
			.col input[type="button"]:hover{background:#00478f}
			.col input[type="submit"]:first-child{margin-left:0}
			.col input[type="submit"]{background:#009bd4; padding:5px 10px; color:#fff; font-family:arial;font-size:14px; cursor:pointer; border:none; margin-left:10px;}
			.col input[type="submit"]:hover{background:#00478f}
			.errorprompt{
				font-family:Tahoma;
				font-size:15px;
				font-weight:bold;
				color:#0676BD;	
			}
		</style>
			
	</head>
	
	<body>
		<div class="bar">
			Forgot Password
		</div>
		<div align="center" class="col">
			
			<span id="userEmailRequired" class="errorprompt" title="Email Address is required.">
			${message}
			</span>
		</div>
		<div class="col" align="center">
			<input type="button" name="cancel" value="Close" onClick= "javascript:window.close();"/>
		</div>
	</body>
	
	
	
</html>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>YTLC HRMS</title>
		<style>
			body{margin:0; padding:0;}
			.bar{background:#00478f; color:#fff;padding:10px; text-align:center;font-weight:bold; font-family:Tahoma; font-size:16px; margin:20px 0;}
			.col{padding:10px;}
			.col label{font-size:12px; font-family:Tahoma}
			.col input[type="text"]{padding:5px; width:240px;}
			.padingLeft{padding-left: 108px;}
			.col input[type="button"]:first-child{margin-left:0}
			.col input[type="button"]{background:#009bd4; padding:5px 10px; color:#fff; font-family:Tahoma;font-size:14px; cursor:pointer; border:none; margin-left:10px;}
			.col input[type="button"]:hover{background:#00478f}
			.col input[type="submit"]:first-child{margin-left:0}
			.col input[type="submit"]{background:#009bd4; padding:5px 10px; color:#fff; font-family:Tahoma;font-size:14px; cursor:pointer; border:none; margin-left:10px;}
			.col input[type="submit"]:hover{background:#00478f}
		</style>
	<style type="text/css">
		fpwd{ 
				font-family:Tahoma;
				font-size:12px;
				color:#333;
				text-decoration:underline;
				}	
	</style>
	</head>
	
	<body>
		<div class="bar">
			Forgot Password
		</div>
		<form:form method="post" action="resetPassword.usr">
		<div class="col">
			<form:label path="email">Email Address:</form:label>
			<form:input path="email" />
			<span id="userEmailRequired" class="errorprompt" title="Email Address is required."></span>
		</div>
		<div class="col padingLeft">
			<input type="submit" name="submit" value="Submit" /> <input type="button" name="cancel" value="Cancel" onClick= "javascript:window.close();"/>
		</div>
		</form:form>
	</body>
	
	
	
</html>
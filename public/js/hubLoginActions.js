window.onload=function(){
	document.getElementById('join').addEventListener('click',
	function() {
		document.querySelector('.signUpBg').style.display = 'flex';
	});

	document.querySelector('.close').addEventListener('click', 
		function() {
		document.querySelector('.signUpBg').style.display = 'none';
	});

}





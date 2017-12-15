$(function(){
	// 当点击向下按钮时，页面滚动一定的距离
	$('.icon').focus(function(){
		$(window).scrollTop(661);
	})

	// 点击menu显示右侧菜单栏
	$('.menu').focus(function(){
		$(this).css({"backgroundColor":"#111","color":"#fff"}).parents('.header').animate({right:145},'slow');
		$('.menus').animate({right:0},'slow');
		// $('.header').animate({right:145},'slow');
	})

	// 点击关闭按钮，隐藏右侧菜单栏
	$('.icon-close').click(function(){
		$(this).parents('.menus').animate({right:-240},'slow');
	})
})
const swiper = new Swiper('.swiper', {
	// Optional parameters
	direction: 'horizontal',
	loop: true,
	slidesPerView: 1,
	spaceBetween: 40,
	autoplay: {
		delay: 3000,
		pauseOnMouseEnter: true,
		disableOnInteraction: false,
	},

	breakpoints: {
		920: {
			slidesPerView: 2,
			spaceBetween: 40,
		},
	},
})

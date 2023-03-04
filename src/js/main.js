const burgerBtn = document.querySelector('.burger-btn')
const burgerLines = document.querySelectorAll('.burger-btn-line')
const navLinks = document.querySelectorAll('.nav__link')
const logo = document.querySelector('.nav__logo')
const navLinksBox = document.querySelector('.nav__links')
const nav = document.querySelector('.nav')
const topSection = document.querySelector('header')
const footerSpan = document.querySelector('.footer__year')
const allFleetBtns = document.querySelectorAll('.fleet__btn')
const allFleetSections = document.querySelectorAll('.fleet__car')
const nextBtn = document.querySelector('.next')
const prevBtn = document.querySelector('.prev')
const submitBtn = document.querySelector('.submit-btn')
const submitBtnHidden = document.querySelector('.submit-btn-main')
const quoteModal = document.querySelector('.quote__modal')
const allPages = document.querySelectorAll('.page')
const nameInput = document.querySelector('#name')
const emailInput = document.querySelector('#mail')
const phoneInput = document.querySelector('#phone')
const collectionInput = document.querySelector('#from')
const destinationInput = document.querySelector('#to')
const finalPriceInput = document.querySelector('#finalPrice')
const dateInput = document.querySelector('#date')
const liftCollectionPlaceRadios = Array.from(document.querySelectorAll('#liftCol'))
const collectionFloorInput = document.querySelector('#collFloor')
const lifDeliveryPlaceRadios = Array.from(document.querySelectorAll('#deli'))
const deliveryFloorInput = document.querySelector('#delivFloor')
const paperworkRadioInputs = Array.from(document.querySelectorAll('#paper'))
const messageInput = document.querySelector('#textarea')
const select = document.querySelector('#space')
const totalDistanceInput = document.querySelector('#totalDistance')
const discountInput = document.querySelector('#discount-code')
let formStep = 1
let finalDistance
const fleetInfo = {
	1: {
		vehicle: 'van-1v',
		pathToFile: 'dist/img/images/van5.png',
		explanation: '1m3 = length: 1m width: 1m height: 1m',
		maxWeight: '250 kg',
		boxesQuantity: 8,
		back: 'mini',
	},
	5: {
		vehicle: 'van-5v',
		pathToFile: 'dist/img/images/van5.png',
		explanation: '5m3 = length: 1.05m width: 2.2m height: 2.2m',
		maxWeight: '250 kg',
		boxesQuantity: 40,
		back: 'mini',
	},
	10: {
		vehicle: 'van-10v',
		pathToFile: 'dist/img/images/van10.png',
		explanation: '10m3 = length: 2.1m width: 2.2m height: 2.2m',
		maxWeight: '500 kg',
		boxesQuantity: 80,
		back: 'mini',
	},
	20: {
		vehicle: 'van20-v',
		pathToFile: 'dist/img/images/van20.png',
		explanation: '20m3 = length: 4.2m width: 2.2m height: 2.2m',
		maxWeight: '1000 kg',
		boxesQuantity: 160,
		back: 'mini',
	},
	40: {
		vehicle: 'small-lorry-v',
		pathToFile: 'dist/img/images/semi40.png',
		explanation: '40m3 = length: 6.5m width: 2.4m height: 2.6m',
		maxWeight: '2000 kg',
		boxesQuantity: 320,
		back: 'big',
	},
}

// input autocompletion
let collectionautocomplete
let destinationautocomplete
let didUserUseAutocomplationForCollectionCity = false
let didUserUseAutoComplationForDestinationCity = false

function initMap() {
	collectionautocomplete = new google.maps.places.Autocomplete(document.getElementById('from'), {
		types: ['geocode'],
	})
	destinationautocomplete = new google.maps.places.Autocomplete(document.getElementById('to'), {
		types: ['geocode'],
	})
	google.maps.event.addListener(collectionautocomplete, 'place_changed', function () {
		let place = collectionautocomplete.getPlace()

		didUserUseAutocomplationForCollectionCity = true
	})
	google.maps.event.addListener(destinationautocomplete, 'place_changed', function () {
		let place = destinationautocomplete.getPlace()

		didUserUseAutoComplationForDestinationCity = true
	})

	collectionInput.addEventListener('keydown', () => {
		didUserUseAutocomplationForCollectionCity = false
	})
	destinationInput.addEventListener('keydown', () => {
		didUserUseAutoComplationForDestinationCity = false
	})
}

const handleNav = () => {
	burgerLines.forEach(line => {
		line.classList.toggle('opened')
	})
	navLinksBox.classList.toggle('active')
	document.body.classList.toggle('fixed-page')
	deleteClassOnDesktop()
}

const closeNav = () => {
	burgerLines.forEach(line => {
		line.classList.remove('opened')
	})
	navLinksBox.classList.remove('active')
	document.body.classList.remove('fixed-page')
}

const navObserver = new IntersectionObserver(
	(entries, observer) => {
		const entry = entries[0]
		if (!entry.isIntersecting) {
			nav.classList.add('mobiled')
			nav.classList.remove('first-l')
		} else {
			nav.classList.remove('mobiled')
		}
	},
	{
		threshold: 0.93,
	}
)
const handleObserver = () => {
	navObserver.observe(topSection)
}

const deleteClassOnDesktop = () => {
	if (window.innerWidth > 992) {
		closeNav()
		navLinksBox.classList.remove('mobiled')
		if (document.body.dataset.id === 'main') {
			handleObserver()
		} else {
			nav.classList.add('mobiled')
		}
	} else {
		navLinksBox.classList.add('mobiled')
		nav.classList.add('mobiled')
		navObserver.disconnect()
	}
}

const handleCar = e => {
	allFleetBtns.forEach(btn => {
		btn.classList.remove('active-btn')
	})
	e.target.classList.add('active-btn')

	allFleetSections.forEach(section => {
		section.classList.add('hidden-car')
		section.classList.remove('active-car')
	})

	const carId = e.target.dataset.id
	const activeSection = document.getElementById(carId)
	activeSection.classList.remove('hidden-car')
	activeSection.classList.add('active-car')
}

const handleNextPage = e => {
	e.preventDefault()
	switch (formStep) {
		case 1:
			validateFirstPage()
			const neccessaryFirstPageInputs = [nameInput, emailInput, phoneInput, collectionInput, destinationInput]
			const isPageValid = checkPageValidaty(neccessaryFirstPageInputs)
			if (!isPageValid) {
				return
			}

			break
		case 2:
			validateSecondPage()
			const isSecondPageValid = checkPageValidaty([select])
			if (!isSecondPageValid) {
				return
			}
			break
		case 3:
			validateThirdPage()
			const neccessaryThirdPageInputs = [
				collectionFloorInput,
				deliveryFloorInput,
				...lifDeliveryPlaceRadios,
				...liftCollectionPlaceRadios,
				...paperworkRadioInputs,
			]
			const isThirdPageValid = checkPageValidaty(neccessaryThirdPageInputs)
			if (!isThirdPageValid) {
				return
			} else {
				quoteModal.classList.add('modal-visible')
				formSubmissionHandler()
			}

			break
	}

	formStep++
	if (formStep > 3) {
		formStep = 3
	}

	handleButtons(formStep)
}

const formSubmissionHandler = () => {
	getDistance(collectionInput.value, destinationInput.value)
}

const getDistance = (pointA, pointB) => {
	const service = new google.maps.DistanceMatrixService()
	service.getDistanceMatrix(
		{
			origins: [pointA],
			destinations: [pointB],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.metric,
			avoidHighways: false,
			avoidTolls: false,
		},
		callback
	)
}
const callback = (response, status) => {
	if (status != google.maps.DistanceMatrixStatus.OK) {
		alert('An error occurred while submitting the form, contact us via phone or e-mail to get the quote')
	} else {
		if (response.rows[0].elements[0].status === 'ZERO_RESULTS') {
			alert('No routes between locations. If you think its an error, contact us via phone about your move')
		} else {
			const distance = response.rows[0].elements[0].distance
			const distanceInKilometers = distance.value / 1000
			finalDistance = Math.round(distanceInKilometers)
			countPrice()
		}
	}
}

const countPrice = () => {
	let basicPrice = 0
	const doesHaveLiftCollection = liftCollectionPlaceRadios.find(input => input.checked).value
	const collectionFloor = collectionFloorInput.value
	const doesHaveLiftDestination = lifDeliveryPlaceRadios.find(input => input.checked).value
	const destinationFloor = deliveryFloorInput.value
	const doesWantPaperworkDone = paperworkRadioInputs.find(input => input.checked).value

	const selectValue = +select.value

	if (selectValue === 1) {
		basicPrice = 500 + finalDistance * 0.2
	} else if (selectValue == 5) {
		basicPrice = 500 + finalDistance * 0.6
	} else if (selectValue == 10) {
		basicPrice = 1000 + finalDistance * 0.6
	} else if (selectValue == 20) {
		basicPrice = 1500 + finalDistance * 1
	} else if (selectValue == 40) {
		basicPrice = 2500 + finalDistance * 2
	}

	if (doesWantPaperworkDone === 'yes') {
		basicPrice += 180
	}

	const collectionFee = addFloorFee(selectValue, +collectionFloor, doesHaveLiftCollection)
	const deliveryFee = addFloorFee(selectValue, +destinationFloor, doesHaveLiftDestination)
	basicPrice += collectionFee
	basicPrice += deliveryFee

	const discount10percentCode = '19061989'
	const discount20percentCode = '07042007'

	if (discountInput.value.trim() === discount10percentCode) {
		const discount = 0.1 * basicPrice
		basicPrice = basicPrice - discount
	} else if (discountInput.value.trim() === discount20percentCode) {
		const discount = 0.2 * basicPrice
		basicPrice = basicPrice - discount
	}

	totalDistanceInput.value = finalDistance
	finalPriceInput.value = Math.round(basicPrice)
	submitBtnHidden.click()
	// form submitted let php file work
}

const addFloorFee = (cubicMeters, floor, isLiftAvailable) => {
	let floorFee = 0
	if (floor === 0 || floor === 1) {
		return floorFee
	}

	if (cubicMeters === 40 || cubicMeters === 20) {
		if (isLiftAvailable === 'yes') {
			floorFee = 100
		} else {
			floorFee = floor * 100
		}
	} else {
		if (isLiftAvailable === 'yes') {
			floorFee = 50
		} else {
			floorFee = floor * 50
		}
	}
	return floorFee
}

const checkPageValidaty = inputsArray => {
	let isPageValidd

	const inputsValidatyArray = inputsArray.map(input => {
		if (input.dataset.error === 'true') {
			return false
		}
	})

	if (inputsValidatyArray.includes(false)) {
		isPageValidd = false
	} else {
		isPageValidd = true
	}

	return isPageValidd
}
const validateFirstPage = () => {
	checkLength(nameInput, 2)
	checkEmail(emailInput)
	checkLength(phoneInput, 9)
	if (!didUserUseAutocomplationForCollectionCity) {
		setError(collectionInput)
	} else {
		clearError(collectionInput)
	}
	if (!didUserUseAutoComplationForDestinationCity) {
		setError(destinationInput)
	} else {
		clearError(destinationInput)
	}
}
const validateSecondPage = () => {
	const isValueChosen = +select.value === 0 ? false : true

	isValueChosen ? clearError(select) : setError(select)
}

const validateThirdPage = () => {
	checkRadioButtons(liftCollectionPlaceRadios)
	checkRadioButtons(lifDeliveryPlaceRadios)
	checkRadioButtons(paperworkRadioInputs)
	checkFloorInput(collectionFloorInput)
	checkFloorInput(deliveryFloorInput)
}

const checkRadioButtons = radiobuttons => {
	let isRadioButtonClicked

	if (radiobuttons[0].checked || radiobuttons[1].checked) {
		isRadioButtonClicked = true
		clearRadioError(radiobuttons[0])
		clearRadioError(radiobuttons[1])
	} else {
		isRadioButtonClicked = false
		setRadioError(radiobuttons[0])
		setRadioError(radiobuttons[1])
	}
}
const checkFloorInput = input => {
	if (+input.value >= 0 && +input.value <= 8 && input.value.trim() !== '') {
		clearError(input)
	} else {
		setError(input)
	}
}

const checkLength = (input, minLength) => {
	if (input.value.trim().length < minLength) {
		setError(input)
	} else {
		clearError(input)
	}
}

const checkEmail = input => {
	const re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (re.test(input.value)) {
		clearError(input)
	} else {
		setError(input)
	}
}

const setError = input => {
	const inputParent = input.parentElement
	const errorParagraph = inputParent.querySelector('.error-msg')
	errorParagraph.classList.add('error-visible')
	input.setAttribute('data-error', true)
}

const clearError = input => {
	const inputParent = input.parentElement
	const errorParagraph = inputParent.querySelector('.error-msg')
	errorParagraph.classList.remove('error-visible')
	input.removeAttribute('data-error')
}

const clearRadioError = input => {
	const inputParent = input.parentElement.parentElement.parentElement
	const errorParagraph = inputParent.querySelector('.error-msg')

	errorParagraph.classList.remove('error-visible')
	input.removeAttribute('data-error')
}

const setRadioError = input => {
	const inputParent = input.parentElement.parentElement.parentElement
	const errorParagraph = inputParent.querySelector('.error-msg')
	errorParagraph.classList.add('error-visible')
	input.setAttribute('data-error', true)
}

const handleButtons = formStep => {
	if (formStep >= 2) {
		prevBtn.classList.remove('hidden-form-btn')
	} else {
		prevBtn.classList.add('hidden-form-btn')
	}
	if (formStep === 3) {
		nextBtn.classList.add('hidden-next')
		submitBtn.classList.remove('hidden-btn')
	} else {
		submitBtn.classList.add('hidden-btn')
		nextBtn.classList.remove('hidden-next')
	}
	renderCurrentPage(formStep)
}

const renderCurrentPage = pageNumber => {
	allPages.forEach(page => {
		page.classList.remove('active-page')
		page.classList.add('hidden-page')
	})
	const activePage = document.querySelector(`[data-page="${pageNumber}"]`)
	activePage.classList.remove('hidden-page')
	activePage.classList.add('active-page')
}

const handlePrevPage = e => {
	e.preventDefault()
	formStep--
	handleButtons(formStep)
}

const current__year = () => {
	const date = new Date()
	const year = date.getFullYear()
	footerSpan.textContent = year
}

const handleSpace = () => {
	clearError(select)
	const placeToRenderElements = document.querySelector('.vehicle-content')
	placeToRenderElements.innerHTML = ''
	const vehicleInfo = fleetInfo[select.value]

	const explanationParagraph = document.createElement('p')
	explanationParagraph.classList.add('quote__explanation')
	explanationParagraph.textContent = vehicleInfo.explanation
	placeToRenderElements.append(explanationParagraph)

	const maxWeightParagraph = document.createElement('p')
	maxWeightParagraph.classList.add('quote__explanation-second')
	maxWeightParagraph.textContent = `Max weight is: ${vehicleInfo.maxWeight}`
	placeToRenderElements.append(maxWeightParagraph)

	const boxPlace = document.createElement('div')
	boxPlace.innerHTML = `
	<div class="quote__box-image">
		<div class="main-box">
			<img class="box" src="./dist/img/images/box.png" alt="box">
			<p class="count">${vehicleInfo.boxesQuantity}x</p>
		</div>

		<p class="dimensions">50cm x 50cm x 50cm</p>
	</div>`
	placeToRenderElements.append(boxPlace)

	const frontImgDiv = document.createElement('div')
	const divParent = document.createElement('div')

	const frontImg = document.createElement('img')
	frontImg.src = vehicleInfo.pathToFile
	frontImgDiv.classList.add('van-front')
	frontImgDiv.classList.add(`${vehicleInfo.vehicle}`)

	divParent.append(frontImg)
	frontImgDiv.append(divParent)
	placeToRenderElements.append(frontImgDiv)

	const backImgDiv = document.createElement('div')
	const backImg = document.createElement('img')
	const divInside = document.createElement('div')
	divInside.classList.add('inside')
	backImgDiv.append(divInside)

	backImg.alt = 'Illustration of the vehicle'
	if (vehicleInfo.back === 'mini') {
		backImg.src = './dist/img/images/mini.png'
		backImgDiv.classList.add('mini-div')
	} else {
		backImg.src = './dist/img/images/big.png'
		backImgDiv.classList.add('big-div')
	}
	backImgDiv.classList.add('van-back')
	divInside.append(backImg)
	backImgDiv.append(divInside)
	placeToRenderElements.append(backImgDiv)
}
current__year()
deleteClassOnDesktop()
navLinks.forEach(link => {
	link.addEventListener('click', handleNav)
})
select.addEventListener('change', handleSpace)
prevBtn.addEventListener('click', handlePrevPage)
nextBtn.addEventListener('click', handleNextPage)
submitBtn.addEventListener('click', handleNextPage)
allFleetBtns.forEach(btn => btn.addEventListener('click', handleCar))
burgerBtn.addEventListener('click', handleNav)
logo.addEventListener('click', closeNav)
window.addEventListener('resize', deleteClassOnDesktop)

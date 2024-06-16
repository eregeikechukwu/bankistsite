'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-05-19T17:01:17.194Z',
    '2024-05-21T23:36:17.929Z',
    '2024-05-23T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-05-10T14:43:26.374Z',
    '2024-05-21T18:49:59.371Z',
    '2024-05-23T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    useGrouping: true,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    console.log(sec);

    //In each call, print the remaining time to UI
    labelTimer.textContent = min + ':' + sec;

    //When 0 seconds, stop timer and log out user

    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    //Decrease time
    time--;
  };

  //Set time to five minutes
  let time = 120;

  //Call the timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// //FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//EXPERIMENTING API
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  // weekday: 'long',
};

// const locale = navigator.language;

console.log(currentAccount);

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current time and Date

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()})`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Labelling Date
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    console.log(timer);
    console.log(currentAccount);

    //Timer

    if (timer) {
      clearInterval(timer);
    } else {
      console.log('no timer');
    }
    timer = startLogoutTimer();
    console.log(timer);

    //Log out timer
    startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Applying Dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    ///Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);

      //Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      ///Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 4000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// prompt('hjgjhbjbjbnj');

///////////////////////////////////////////////
//Create Account
document.querySelector('.fBtn').addEventListener('click', function (event) {
  event.preventDefault();

  const fName = document.querySelector('.fName');
  console.log(fName.value);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
/////////////////////////////////////////////////
//CONVERTING AND CHECKING NUMBERS
console.log(23 === 23.0); //The result is treu because nu,bers are primarily represented as decimals

//Base 10 - 0, 1 / 10 = 0.1, 10/3 = 3.3333333...
//Binary base 2 - 0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3); //This is goint to give us a false, becsuase thats a javascript error

//CONVERSION
console.log(Number('23')); //This was the initial way of transforming strings to numbers, but there is a simplified one below
console.log(+'23'); // this would be converted through type coercion

//PARSING
console.log(Number.parseInt('30px')); //THE pasreint method here parses teh number 8n that text and converts it into a number
console.log(Number.parseInt('e23')); //THe parseint method wont work if the text starts with a letter

console.log(Number.parseInt('2.5rem'));
console.log(Number.parseFloat('  2.5rem  ')); //The parsefloat is just like the parseint, but the parse float is also able to parse decimal numbers

//Traditionally ,we can use parseint and parsefloat without the nubers object attached to it, but the best way tu use it is by using the numbers object with it
// console.log(parseFloat('2.5rem'));

//CHECKING IF VLUE IS A NUMBER
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'23X'));
console.log(Number.isNaN(23 / 0));

//CHECKING IF VALUE IS A NUMBER
console.log(Number.isFinite(26));
console.log(Number.isFinite('26')); //Betweeen isNaN and  isFinite, the one thats better for checking if a value is a number is isFinite
console.log(Number.isFinite(+'25Y')); ///This is going to give us a alse cuz tht value isnt a number
console.log(Number.isFinite(23 / 0)); //THis will give us false too

console.log(Number.isInteger(23)); //True
console.log(Number.isInteger('23')); //false
console.log(Number.isInteger(23 / 0)); //false
*/

//FINAL NOTE: In parsing or retrieving  a number, the best method to use it the parsefloat method, in checking if a value is a number, practically the best to use are .isFinite, .isInteger

/*
//////////////////////////////////////////////////////////
//MATH AND ROUNDING
//Finding the square root
console.log(Math.sqrt(25)); //We use the math.sqrt function to find the squareroot of a number
console.log(25 ** 1 / 2); //We can find the ssquareroot using thw exponentisl metod too, like in math, its just  equal to 25 ^ 1/2, wqhich  in math is the squareroot of the number;
console.log(8 ** 1 / 3); //cuberoot using the exponential method

console.log(Math.max(5, 18, 23, 11, 2)); //As the name of the method implies, its used to check the highedt number in a set of numbers
console.log(Math.max(5, 18, '23', 11, 2)); //This method also does type coercion
console.log(Math.max(5, 18, '23px', 11, 2)); //but it doesnt do parsing

console.log(Math.min(5, 18, '23px', 11, 2)); //we also have marh.mij which does as it implies

console.log(Math.PI); //WE also have math constants
console.log(Math.PI * Number.parseFloat('10px') ** 2); //THis is the code to find the area of of circle

///Generating random numbers function
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// Rounding Integers
console.log(Math.round(23.9)); //thsi method works  like the math.trunc, but this one diesnt work with negative numbers
console.log(Math.round(23.4));

console.log(Math.ceil(23.9));
console.log(Math.ceil(23.4)); //This one rounds all the values up amd doesnt work with negative numbers

console.log(Math.floor(23.9));
console.log(Math.floor(23.4)); //This method works in all ramifications

//REMEMBER hat they all aslso do type coercion
console.log(Math.trunc(23.9));
console.log(Math.trunc(23.4));

//ROUNDING DECIMALS
console.log((2.7).toFixed(0)); //The .tofixed method is used to round off numbers to a specified decimal place
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
console.log(+(2.375).toFixed(2));
*/

//NOTE: THeese work like the strings, because numbers are primitives, and so they dont have methods, so the jaavaascript engine does boxing on  the number which convrts it into an object and run the  method on it and after returns it back to its original state

/*
/////////////////////////////////////////////////////////////
//THE REMAINDER OPERATOR
console.log(5 % 2);
console.log(5 / 2); //This is the remainder operator(%), its used to  get the modulus of two numbers

console.log(8 % 3);
console.log(8 / 3);

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
//A function to check if a number is even or not
console.log(isEven(44));
console.log(isEven(5));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    if (i % 3 === 0) row.style.backgroundColor = 'lightgreen';

    if (i % 4 === 0) row.style.backgroundColor = 'lightblue';

    if (i === 1) row.style.backgroundColor = 'yellow';
    ``;
    row.style.backgroundColor = 'lightgreen';
  });
});
*/

/*
///////////////////////////////////////////////////////////////
///BIG INT
console.log(2 ** 53 - 1); //this is the biggest number that can be represented in js

console.log(Number.MAX_SAFE_INTEGER); //Annd this biggest number is stored in this variable
console.log(2 ** 53 - 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3); //If you notice, after this biggest number, operations with it don have precision
console.log(2 ** 53 + 4);

console.log(66887875676764655365354665465564646546476467675765); //And apparently, js will definitely come across those very large numbers, so thats where the bigInt was introduced

console.log(66887875676764655365354665465564646546476467675765n); //The bigInt here is denoted by the letter 'n', which converts it into a bigInt.

console.log(BigInt(66887875676764655365354665465564646546476467675765)); //we can also invoke the big int using a bigint method, but teh problem with the method is, if you noticed the numbers changed, and this is because javascript willl initially evaluate the number as a a bigint before joining it withg the other numbers, so its advised to use the method on smaller numbers

console.log(BigInt(3939030));

//Operations
//We can use the bigInt for operations like regular numbers
console.log(1233444n + 34566556n);
console.log(1233444687454625218525274n + 34566556461411455732145588983990n);

console.log(1233444687454625218525274n * 34566556461411455732145588983990n);

// console.log(Math.sqrt(16n)); //This doesnt work

const huge = 687887888678878n;
const num = 44;

console.log(huge * BigInt(num)); //but, you cant do an operation with a bigInt and a normal number, thats where the bigInt method comes in

//Exception
console.log(20n > 15); //comparison operators are exceptions
console.log(20n === 20); //this is false because strict equality doesnt do type coercion, yeah, they are two different primitive types
console.log(typeof 20n);
console.log(2n == 20);

console.log(huge + ' is REALLY big!!!'); //Another exception is concatenating big ints with strings

//DIVISIONS
console.log(11n / 3n); // this converts the result to the nearest bigIntand cuts off the decimalls
console.log(10 / 3);

*/

/*
//////////////////////////////////////////////////////////
//CREATING DATES
const now = new Date();
console.log(now);

//By passing in strings
console.log(new Date('Dec 16 2007 18:05:41'));
console.log(new Date('May 2008, 10'));

console.log(new Date(2037, 10, 19, 15, 23, 5)); //The month in javascript is xero based

console.log(new Date(2037, 10, 33)); //If you noticed the javascripts aligns and reesolves the dates, as you can see november has only thirty days, the reest of the days ae shifted to next month

console.log(new Date(0)); //This is the unix ffirst initial time
console.log(3 * 24 * 60 * 60 * 1000); //this produces the time stamp

//Working with date methods
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds()); //Note the month and the day are zero based. The day is the index of the day of the week, where sunday starts at zero

// const Idate = new Date(2007, 11, 16, 3, 30, 33);
// console.log(Idate);

// const IdateY = Idate.getFullYear();

// const IdateS = Idate.getTime();
// console.log(IdateS);

// const nDateT = Date.now();
// console.log(nDateT);

// const timeR = nDateT - IdateS;
// console.log(timeR);
// const yearR = new Date(timeR).getFullYear();
// console.log(yearR);

// const age = yearR - 1970;
// console.log(age);

console.log(future.getTime()); //We use this method to get he time stamp for a particular date. Above there, i did a machine thatcalculates yor age for you😁

console.log(new Date(2142253380000)); //We use timestamps to create dates too

console.log(Date.now()); //This is the time stamp for this moment

//Set properties method
future.setFullYear(2040);
console.log(future);
//The set method sets the value in the bracket as the functioning time unit as specified. W have setFullYear, setFullmonth, and akl that
*/

/*
const calculateAge = function (ageA) {
  const age = new Date(ageA);
  console.log(age);
  const ageS = age.getTime();
  console.log(ageS);
  const nowS = Date.now();

  const tD = nowS - ageS;
  console.log(tD);

  const cD = new Date(tD);
  console.log(cD);

  const yearI = cD.getFullYear();
  const month = cD.getMonth();
  const date = cD.getDate();

  console.log(yearI, month, date);

  const year = yearI - 1970;

  return `You have lived for ${year} years,  ${
    month > 1 ? month + ' months' : 'a month'
  }  and ${date > 1 ? date + ' days' : 'a day'}!!!`;
};
*/

// const dec = 'April 1 2007 ';
// console.log(dec);
// console.log(calculateAge(dec));
/*
const future = new Date(2037, 11, 12, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 24));
console.log(days1);
*/

///////////////////////////////////////////////////////////////////////////////
//INTERNATIONALIZING NUMBERS
//THis intl.Number..... methofd is self explanatory, you just need to memorize the format
//rhe argument inside the method is the countries formsat o representing numbers, then the .format is used to specify the element to be modified. and te options object here is used to modify the dates numbers format. This whole method and functionality also works for dates, but the method for dates is called 'Intl.DateTimeFormat()

/*
const optionsE = {
  style: 'currency', //The style can be in three fotmats: currency, units and percentage
  unit: 'celsius',
  currency: 'EUR', //note: When we are using the style:currency, we dont expect the currency to automatically set based onlocatio, we compulsorily have to specify it too
  // useGrouping:false//this one is used to  set the groupin of the numbers on/off
};

const num = 6564427.86;

console.log('US    ', new Intl.NumberFormat('en-US').format(num));
console.log('Germany   ', new Intl.NumberFormat('de-DE').format(num));
console.log('Syria:    ', new Intl.NumberFormat('ar-SY').format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
);
*/

///////////////////////////////////////////////////
//SETTIMEOUT AND SETINTERVAL
//Tyhis set timeout function here, as we've used before is usedto set a time interval before a function isa called

const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza🍕 with ${ing1} and ${ing2}`),
  4000,
  ...ingredients
);
console.log('Waiting...'); //Due to the nature of the set timeout function, we cant call this functon and pass arguments in it, so the values defined after the time interval are taling as the first, second and sequentially that  way

//Wwe can actually delete a set timeout function before it loads

if (ingredients.includes('spinach')) {
  clearTimeout(pizzaTimer);
}

//Set Interval
//WE can set intervals for a function to be called spontaneously

setInterval(function () {
  const now = new Date();
  // console.log(now);
}, 1000);
//We can also use clearInterval method on this too

/*
/////////////////////////////////////////////////////
//A CLOCK
const ho = document.querySelector('.hour');
const min = document.querySelector('.minute');
const sec = document.querySelector('.seconds');
const mill = document.querySelector('.milliseconds');

let hourI;
let minuteI;
let secondsI;
let millisecondsI;

let clockIn;

const clock = function name() {
  const now = new Date();
  const hours = `${
    now.getHours > 12 ? now.getHours() - 12 : now.getHours()
  }`.padStart(2, 0);
  const minute = `${now.getMinutes()}`.padStart(2, 0);
  const seconds = `${now.getSeconds()}`.padStart(2, 0);
  const milliseconds = `${now.getMilliseconds()}`.padStart(3, 0);

  console.log(hours, minute, seconds);
  ho.textContent = hours;
  min.textContent = minute;
  sec.textContent = seconds;
  mill.textContent = milliseconds;

  hourI = hours;
  minuteI = minute;
  secondsI = seconds;
  millisecondsI = milliseconds;
};

const mFunc = function () {
  console.log('main function');
  clockIn = setInterval(() => {
    clock();
  }, 1);
};

clockIn;

// clearInterval(clockIn);

const snap = function () {
  clearInterval(clockIn);
  console.log('Snap units:    ', hourI, minuteI, secondsI, millisecondsI);
};

let functionActive = true;

document.addEventListener('keydown', function (event) {
  if (event.which === 32 || event.keycode === 32 || event.code === 'Space') {
    event.preventDefault();
    console.log('I was pressed');
    if (functionActive === true) {
      snap();
      // clearInterval(clockIn);
      console.log(functionActive);
    } else {
      setInterval(function () {
        clock();
      }, 1);
      console.log(functionActive);
      console.log(clockIn);
    }

    functionActive = !functionActive;
  }
});

*/

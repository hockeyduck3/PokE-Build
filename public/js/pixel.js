const $colorPicker = $('#colorPicker');
//code for the pokemon stats
const $hp = $('#hp');
const $speed = $('#speed');
const $defense = $('#defense');
const $spDefense = $('#SP_Defense');
const $attack = $('#attack');
const $spAttack = $('#SP_Attack');

let nextName;
// let user;

//prottype object for pokemon stat object
const stats = {
  hp: 0,
  speed: 0,
  defense: 0,
  spDefense: 0,
  attack: 0,
  spAttack: 0
};

$(document).ready(() => {
  $.ajax({
    url: '/api/auth/user'
  }).then(res => {
    // user = res;

    $('.userNameText').text(res.username);

    if ($('.userNameText').text() === '') {
      // eslint-disable-next-line prettier/prettier
      $('.userBtn').append($('<a>').attr({ href: '/signup' }).addClass('dropdown-item').text('Sign up'));
      // eslint-disable-next-line prettier/prettier
      $('.userBtn').append($('<a>').attr({ href: '/login' }).addClass('dropdown-item').text('Sign in'));
    } else {
      // eslint-disable-next-line prettier/prettier
      $('.userBtn').append($('<a>').attr({ href: '/api/auth/logout' }).addClass('dropdown-item').text('Log out'));
    }
  });

  addCellClickListener();
  //Call this on page load to give the initial amount of poitns avaialable.
  pointPoolUpdater();
  //this will imeaditely create an object to use later for the maker ID in the db
  creatorIdFunction();
  // appends all of the mvoes to the move selctor dropdowns on load
  appendMoves();
});

//Adds a color to the clicked on cell
function addCellClickListener() {
  $('table').click(event => {
    if ($('table').hasClass('enabled')) {
      if (event.target.matches('td')) {
        const color = $colorPicker.val();
        $(event.target).css('background-color', color);
      }
    }
  });
}

// Toggles grid opacity
$('#toggle').click(() => {
  $('td').toggleClass('opacity');
});

$('#fname').on('keydown', () => {
  // eslint-disable-next-line prettier/prettier
  if ($('#fname').val().trim() !== '') {
    $('.nameNext').slideDown('slow');
  } else {
    $('.nameNext').slideUp('slow');
  }
});

$('#nameInputDiv').on('submit', event => {
  event.preventDefault();
  nextName = 'name';
  goToNext();
});

$('.nameNext').click(() => {
  nextName = 'name';
  //create object for pokemone name with a searchable name (lowercase) for db
  const pokemonName = new Object();
  pokemonName.name = $('#fname').val();
  pokemonName.searchableName = $('#fname')
    .val()
    .toLowerCase();
  console.log(pokemonName);
  goToNext();
});

$('.pixelNext').click(() => {
  nextName = 'pixel';
  //palceholder empty array to hold td cell color information.
  const pixels = [];
  //placeholder empty object to add the array
  const spriteObject = {
    sprite: []
  };
  //function to loop through the td cells and grab the css background color and push it into an array
  $('td').each(function() {
    const colorVals = $(this)
      .css('background-color')
      .match(/rgb\((\d+), (\d+), (\d+)\)/);
    pixels.push(colorVals[1], colorVals[2], colorVals[3], 255);
  });
  const newPokeSprite = Object.create(spriteObject);
  newPokeSprite.sprite = pixels;
  console.log(newPokeSprite);
  $('table').toggleClass('enabled');
  goToNext();
});

//button to continue after selcting types
$('.typeNext').click(() => {
  nextName = 'type';
  goToNext();
});

function goToNext() {
  // If the first next button is clicked
  if (nextName === 'name') {
    $('.namePokemonImg').slideUp('slow');
    $('.nameNext').slideUp('slow');

    // Give the above animations time to finish
    setTimeout(() => {
      $('.pixelCreator').addClass('current');
      $('.pixelCreator').slideDown('slow');

      setTimeout(() => {
        $('html, body').animate({ scrollTop: 100 }, 'fast');
      }, 300);
    }, 700);
  }

  // If the second next button is clicked
  else if (nextName === 'pixel') {
    $('td').addClass('opacity');
    $('.drawPokemonImg').slideUp('slow');
    $('.tools').slideUp('slow');
    $('.pixelNext').slideUp('slow');

    // Make sure the above animations finish
    setTimeout(() => {
      $('.pixelCreator').removeClass('current');
      $('.chooseType').addClass('current');
      $('.chooseType').slideDown('slow');

      // Wait for the above animations to finish then scroll the page automatically
      setTimeout(() => {
        $('html, body').animate({ scrollTop: 250 }, 'fast');
      }, 300);
    }, 700);
  }

  // If the final next button is clicked
  else {
    // eslint-disable-next-line prettier/prettier
    if ($('.dropdown-2').text() === 'Second Type (optional)') {
      $('.dropdown-2').text('None');
    }

    $('.chooseTypeImg').slideUp('slow');
    $('.typeNext').slideUp('slow');

    // Wait for the above animations to finish
    setTimeout(() => {
      $('.chooseType').removeClass('current');
      $('.chooseStats').slideDown('slow');
      $('.chooseStats').addClass('current');

      setTimeout(() => {
        $('html, body').animate({ scrollTop: 800 }, 'slow');
      }, 500);
    }, 700);
  }
}

$('a').click(function(event) {
  if ($(this).hasClass('first')) {
    event.preventDefault();

    $('.dropdown-1').text($(this).text());

    $('.typeNext').slideDown('slow');

    $('.dropdown-1').text($(this).text());
    const firstType = new Object();
    firstType.type1 = $(this).attr('data-id');
    console.log(firstType);
  } else if ($(this).hasClass('second')) {
    event.preventDefault();

    $('.dropdown-2').text($(this).text());

    const secondType = new Object();
    secondType.type2 = $(this).attr('data-id');
    console.log(secondType);

    $('.typeNext').slideDown('slow');
  }
});

//Point updater
function pointPoolUpdater() {
  //var for the initial point pool the user will have avialible.
  const availablePoints = 1000;
  //this will add up the values of all the points put into stats, and store it in a variable to be used.
  const usedPoints =
    parseInt($hp.val()) +
    parseInt($speed.val()) +
    parseInt($defense.val()) +
    parseInt($spDefense.val()) +
    parseInt($defense.val()) +
    parseInt($spAttack.val());
  if (usedPoints > 1000) {
    //alert user they are over the aloted points
    $('.modalText').text('You have run out of points!');

    $('.modalImg').attr({
      src: '../img/snorlax.jpg',
      alt: 'Snorlax is not pleased'
    });

    $('#myModal').modal('show');
  } else {
    $('#pointPool').text(
      'Current Points Left: ' + (availablePoints - usedPoints)
    );
  }

  //event listiner for when the user submits stats
  $('#statSubmit').click(() => {
    if (usedPoints > 1000) {
      //alert user they are over the aloted points if they try to submit a pokemon that has too many stats
      $('.modalText').text('Your Pokemon is too strong!');

      $('.modalImg').attr({
        src: '../img/pikachu-scare.jpg',
        alt: 'You scared Pikachu with how strong your Pokemon is!'
      });

      $('#myModal').modal('show');
    } else {
      const newPokeStats = Object.create(stats);
      newPokeStats.hp = $hp.val();
      newPokeStats.speed = $speed.val();
      newPokeStats.defense = $defense.val();
      newPokeStats.spDefense = $spDefense.val();
      newPokeStats.attack = $attack.val();
      newPokeStats.spAttack = $spAttack.val();
      console.log(newPokeStats);
    }
  });
}

//event listener for when a user changes the value of a stat
$('#hp, #speed, #defense, #SP_Defense, #attack, #SP_Attack').change(() => {
  pointPoolUpdater();
});

//function to create an object with the current userID to be used in the DB - this is currently set to always be 1 until log in feature is implimented
function creatorIdFunction() {
  const creatorId = 1;
  const creatorIdObject = new Object();
  creatorIdObject.CreatorId = creatorId;
  console.log(creatorIdObject);
}

// function to append the moves into each move selector as well as the move name into a data-name attribute
function appendMoves() {
  let moveSet1;
  let moveSet2;
  // let moveSet1DataId;
  // let moveSet2DataId;
  $.ajax({
    url: 'https://pokeapi.co/api/v2/move/?offset=0&limit=400',
    method: 'GET'
  }).then(response1 => {
    response1.results.forEach(move => {
      moveSet1 = move.name;
      $(
        '#move1Dropdown, #move2Dropdown, #move3Dropdown, #move4Dropdown'
      ).append('<a class="dropdown-item move1" href="">' + moveSet1 + '</a>');
    });
  });

  $.ajax({
    url: 'https://pokeapi.co/api/v2/move/?offset=400&limit=800',
    method: 'GET'
  }).then(response2 => {
    response2.results.forEach(move => {
      moveSet2 = move.name;
      $(
        '#move1Dropdown, #move2Dropdown, #move3Dropdown, #move4Dropdown'
      ).append('<a class="dropdown-item move2" href="">' + moveSet2 + '</a>');
    });
  });
}

$('body').delegate('.move1, .move2', 'click', function(event) {
  event.preventDefault();
  $(this)
    .parent()
    .prev()
    .text($(this).text());

  $('#statSubmit').slideDown('slow');
});

function formatMoveName(move) {
  const words = move.split('-');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1);
  }

  return words.join(' ');
}

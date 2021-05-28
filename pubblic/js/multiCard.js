// $("#recipeCarousel").carousel({
//   interval: 5000
// });

$(".container .carousel .carousel-item").each(function () {
  var minPerSlide = 3;
  // next() va a prossimo elemento
  var next = $(this).next();
  if (!next.length) {
    // aggiunge solo i next
    next = $(this).siblings(":first");
  }
  next.children(":first-child").clone().appendTo($(this));

  for (var i = 0; i < minPerSlide; i++) {
    // aggiunge fino a 3 elementi
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(":first");
    }

    next.children(":first-child").clone().appendTo($(this));
  }
});


var vrvToolkit = new verovio.toolkit();

function loadMEI(url, targetSelector) {
  $.ajax({
      url: url,
      dataType: "text",
      success: function(data) {
        var svg = vrvToolkit.renderData(data, {
          adjustPageHeight: true
        });
        $(targetSelector).html(svg);
      }
  });
}

window.addEventListener('impress:stepenter', function(e) {
  let id = e.target.getAttribute('id');
  if (id === 'grundakkordExplanation') {
    loadMEI("assets/grundakkorde.mei", "#grundakkorde");
    loadMEI("assets/grundakkorde_uebung.mei", "#grundakkordeUebung");
  } else if (id === 'sextakkordExplanation') {
    loadMEI("assets/sextakkord.mei", "#sextakkorde");
    loadMEI("assets/sextakkord_uebung.mei", "#sextakkordeUebung");
  } else if (id === 'petiteSixteExplanation') {
    loadMEI("assets/petitesixte.mei", "#petiteSixte");
    loadMEI("assets/petitesixte_uebung.mei", "#petiteSixteUebung");
  }

  let correspAttr = e.target.getAttribute('data-corresp');
  if (!correspAttr) {
    return;
  }

  let correspList = correspAttr.split(' ')
  for (let i=0; i<correspList.length; i++) {
    document.querySelector(correspList[i]).style.fill = 'red';
  }
});

window.addEventListener('impress:stepleave', function(e) {
  var notes = document.querySelectorAll('.scaleNote');
  for (let i=0; i<notes.length;i++) {
    notes[i].style.fill = 'black';
  }
});

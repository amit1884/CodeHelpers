export const accordianHandler = (function() {
  return {
    toggleDivs: function() {
      var acc = document.getElementsByClassName("accordio");
      for (var i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
          // this.classList.toggle("active");
          var liv = this.nextElementSibling;
          if (liv.style.display === "block") {
            liv.style.display = "none";
          } else {
            liv.style.display = "block";
          }
        };
      }
    }
  };
})();

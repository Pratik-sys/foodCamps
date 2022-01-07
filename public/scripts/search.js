$("#foodground-search").on("input", function () {
  let search = $(this).serialize();
  $.get("/foodgrounds?" + search, function (data) {
    $("#data-card").html("");
    if (data) {
      data.forEach(function (foodground) {
        $("#data-card").append(`
                <div
                class="card mb-2"
                style="max-width: 300px; height: 400px; border: none"
                id="card-click"
                onclick="clickCard('${foodground._id}')"
              >
                <div
                  class="row d-flex justify-content-center align-items-center"
                  style="height: 80%"
                >
                  <img src="${foodground.image.path}" style="width: 300px" />
                </div>
                <div class="row text-center">
                  <h5>${foodground.name}</h5>
                </div>
              </div>
            `);
      });
    }
  });
});

$("#foodground-search").submit(function (event) {
  event.preventDefault();
});

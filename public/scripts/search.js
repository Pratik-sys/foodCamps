$('#foodground-search').on('input', function(){
    var search = $(this).serialize();
    if(search === "search= ") {
        search = "all";
    }
    $.get('/foodgrounds?' + search, function(data){
        $('#foodground-grid').html('');
        data.forEach(function(foodground) {
            $('#foodground-grid').append(`
                <div class="col-md-3 col-sm-6>
                    <div class="thumbnail">
                        <img src="${foodground.image}">
                        <div class="caption">
                            <h4>${foodground.name}</h4>
                        </div>
                        <p>
                            <a href="/foodgrounds/${foodground._id}" class="btn btn-primary">More Info</a>
                        </p>
                    </div>
                </div>
            `);
        });
    });
});

$('#foodground-search').submit(function(event){
    event.preventDefault();
})
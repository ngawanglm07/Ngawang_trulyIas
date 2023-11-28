$(document).ready(function () {
    // Function to load content dynamically
    function loadContent(href) {
        $("#content-container").load(href);
        history.pushState(null, null, href);
    }

    // Event handler for clicks on navbar links
    $(".navbar a").on("click", function (event) {
        event.preventDefault();
        var href = $(this).attr("href");
        loadContent(href);
    });

    // Event handler for back/forward navigation
    $(window).on("popstate", function () {
        loadContent(location.pathname);
    });
});
